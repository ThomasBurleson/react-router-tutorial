import { Contact } from '@mindspace/api';
import { StoreState } from '../_core';

// *******************************************************************
// Types and initializers
// *******************************************************************

/**
 * This state is serializable
 */
export interface ContactsState extends StoreState {
  allContacts: Contact[];
  searchQuery: string;
}

/**
 * Read-only values computed from existing/updated state
 */
export interface ContactsComputedState {
  errors: string[];
}

/**
 * This is a simple API meant for use within the
 * UI layer html templates
 */
export interface ContactsAPI {
  // Contacts CRUD
  loadAll: (query?: string) => Promise<Contact[]>;
  makeNew: () => Promise<Contact>;
  findById: (id: string) => Promise<Contact | null>;
  save: (contact: Contact, optimistic?: boolean) => Promise<Contact>;
  delete: (contact: Contact) => Promise<boolean>;
}

export type ContactsViewModel = ContactsState &
  ContactsAPI &
  ContactsComputedState;
