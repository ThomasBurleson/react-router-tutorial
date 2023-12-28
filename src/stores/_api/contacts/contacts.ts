import localforage from 'localforage';
import { matchSorter } from 'match-sorter';
import sortBy from 'sort-by';
import { Contact, makeContact, makeContactId } from './contacts.model';

/**
 * Publish async API methods for CRUD operations
 * Note: use localforage offline storage for all store contacts
 */

const allContacts = async (): Promise<Contact[]> => {
  return (await localforage.getItem<Contact[]>('contacts')) || [];
};

export async function getContacts(query = ''): Promise<Contact[]> {
  await fakeNetwork(`getContacts:${query}`);
  let contacts = await allContacts();
  if (query) {
    contacts = matchSorter(contacts, query, { keys: ['first', 'last'] });
  }
  return contacts.sort(sortBy('last', 'createdAt'));
}

export async function createContact() {
  await fakeNetwork();

  const contacts = await getContacts();

  const last = `Last ${contacts.length + 1}`;
  const newContact = makeContact({ last });

  await set([newContact, ...contacts]);

  return newContact;
}

export async function getContact(id: string) {
  await fakeNetwork(`contact:${id}`);

  const contacts = await allContacts();
  const contact = contacts.find((contact) => contact.id === id);
  return contact ?? null;
}

export async function updateContact(updated: Contact) {
  await fakeNetwork();
  const contacts = await allContacts();

  if (updated.id) {
    const existing = contacts.find((contact) => contact.id === updated.id);
    if (!existing) throw new Error(`No contact found for ${updated.id}`);

    Object.assign(existing, updated);
    await set(contacts.map((it) => (it.id === existing.id ? existing : it)));

    return existing;
  }

  updated.id = makeContactId();
  updated.createdAt = Date.now();
  await set([...contacts, updated]);

  return updated;
}

export async function deleteContact(id: string) {
  const contacts = await allContacts();
  const index = contacts.findIndex((contact) => contact.id === id);
  if (index > -1) {
    contacts.splice(index, 1);
    await set(contacts);
    return true;
  }
  return false;
}

function set(contacts: Contact[]) {
  return localforage.setItem('contacts', contacts);
}

// fake a cache so we don't slow down stuff we've already seen
let fakeCache: Record<string, Promise<boolean>> = {};

async function fakeNetwork(key = '') {
  if (!key) fakeCache = {};

  if (!fakeCache[key]) {
    fakeCache[key] = new Promise((res) => {
      setTimeout(res, Math.random() * 100);
    });
  }

  return fakeCache[key];
}
