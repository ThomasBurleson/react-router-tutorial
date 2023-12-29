/* eslint-disable @typescript-eslint/no-explicit-any */
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { StoreApi, createStore } from 'zustand/vanilla';

import {
  Contact,
  getContacts,
  getContact,
  deleteContact,
  updateContact,
  createContact,
} from '@mindspace/api';

import {
  getErrorMessages,
  getIsInitializing,
  getIsLoading,
  getIsReady,
  computeWith,
  initStoreState,
  waitFor,
  upsert,
  trackStatusWith,
} from '../_core';
import {
  ContactsAPI,
  ContactsState,
  ContactsViewModel,
} from './contacts.state';

// *******************************************************************
// initializers
// *******************************************************************

/**
 * These ACTIONS enable waitFor() to look up existing, async request (if any)
 */
const ACTIONS = {
  loadAll: () => 'contacts:loadAll',
  findById: (id: string) => `contacts:findById:${id}`,
};

const initState = (): ContactsState => ({
  ...initStoreState(),
  allContacts: [],
  searchQuery: '',
});

// *******************************************************************
// ContactsStore Factory
// *******************************************************************

/**
 * Create an instance of the Zustand store engine for Contacts
 */
export function buildContactsStore(): StoreApi<ContactsViewModel> {
  // Calculate our computed properties
  const buildComputedFn = (
    partial: Partial<ContactsViewModel>
  ): ContactsViewModel => {
    const state = partial as ContactsState;

    const isReady = getIsReady(state);
    const isLoading = getIsLoading(state);
    const showSkeleton = getIsInitializing(state) || state.forceSkeleton;
    const errors = getErrorMessages(state);

    return {
      ...state,
      isLoading,
      isReady,
      showSkeleton,
      errors,
    } as ContactsViewModel;
  };

  /**
   * Factory to create a Zustand Reactive ContactsStore; which emits a ContactsViewModel
   */
  const configureStore = (
    set: (data: any) => any,
    get: () => ContactsState,
    store: StoreApi<ContactsViewModel>
  ): ContactsViewModel => {
    set = computeWith<ContactsViewModel>(buildComputedFn, store);

    const trackStatus = trackStatusWith(get, set);

    const data: ContactsState = initState();
    const computed = buildComputedFn(data);

    const api: ContactsAPI = {
      loadAll: async (query?: string) => {
        const { searchQuery } = get();
        if (query === searchQuery) return get().allContacts;

        const allContacts = await trackStatus<Contact[]>(() =>
          waitFor(ACTIONS.loadAll(), async () => {
            const allContacts = await getContacts(query);
            return { allContacts, searchQuery: query || '' };
          })
        );

        return allContacts;
      },
      makeNew: async () => {
        const contact = await createContact();
        set((state: ContactsState) => ({
          allContacts: upsert(contact, state.allContacts),
        }));
        return contact;
      },
      findById: async (id: string) => {
        const contact = await waitFor<Contact | null>(
          ACTIONS.findById(id),
          () => getContact(id)
        );
        return contact;
      },
      save: async (contact: Contact, optimistic = false) => {
        const saveEntity = (it: Contact) => (state: ContactsState) => {
          const allContacts = upsert(it, state.allContacts);
          return { allContacts };
        };

        if (contact.id === 'new') contact.id = '';
        if (optimistic) set(saveEntity(contact));

        const updated = await updateContact(contact);
        set(saveEntity(updated));
        return updated;
      },
      delete: async (contact: Contact) => {
        const deleted = await deleteContact(contact.id);
        if (deleted) {
          set((state: ContactsState) => ({
            allContacts: state.allContacts.filter((it) => it.id !== contact.id),
          }));
        }
        return deleted;
      },
    };

    // Initial Store view model
    return {
      ...data,
      ...computed,
      ...api,
    };
  };

  /**
   * Enable the ReactiveStore for Redux DevTools, and persistence to localStorage,
   * and ensure the ViewModel is immutable using Immer
   */
  const store = createStore<ContactsViewModel>()(
    // prettier-ignore
    devtools(
        immer(
          configureStore
        ), 
        { name: 'store:contacts' }
      )
  );

  return store;
}

// *******************************************************************
// Singleton instance of the Zustand store engine for Contacts
// *******************************************************************

let _store: StoreApi<ContactsViewModel>;

export const store = () => {
  if (!_store) {
    _store = buildContactsStore();
    syncUrlWithStore(_store);
  }

  return _store;
};

export const api = (): ContactsAPI => {
  return store().getState();
};

// *******************************************************************
// Bookmark URL Synchronizer
// *******************************************************************

const syncUrlWithStore = (_store: StoreApi<ContactsViewModel>) => {
  // On app startup, determine if we have a search query in the URL
  const { searchParams } = new URL(document.location.href);
  const searchQuery = searchParams.get('q');
  if (searchQuery) {
    _store.getState().loadAll(searchQuery);
  }

  // Whenever the searchQuery changes, update the URL
  _store.subscribe((state) => {
    const { searchQuery } = state;
    const { searchParams } = new URL(document.location.href);

    if (searchQuery) searchParams.set('q', searchQuery);
    else searchParams.delete('q');

    const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
    window.history.replaceState({}, '', newUrl);
  });
};
