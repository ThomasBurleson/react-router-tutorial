// *******************************************************************
// React HOOKS
// *******************************************************************

import { useCallback, useEffect } from 'react';
import { useStore } from 'zustand';

import { ContactsAPI, ContactsViewModel } from './contacts.state';
import { store } from './contacts.store';

import { Contact, makeContact } from '@mindspace/api';

/**
 * Hook to build and use Contacts store
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useContacts(selector?: any): ContactsViewModel {
  // Auto-check if publishable
  useEffect(() => {
    const vm = store().getState();
    if (vm.showSkeleton) vm.loadAll();
  }, []);

  // return entire view model or selected slice
  return useStore(store(), selector);
}

/**
 * Hook to load specific contact by ID
 */
export type ContactByIDResults = [Contact | undefined, ContactsAPI];

export function useContactByID(id: string): ContactByIDResults {
  const selector = useCallback(
    (state: ContactsViewModel): ContactByIDResults => {
      const contact =
        id === 'new'
          ? makeContact()
          : state.allContacts.find((it) => it.id === id);
      return [contact, state];
    },
    [id]
  );

  // return entire view model or selected slice
  return useStore(store(), selector);
}
