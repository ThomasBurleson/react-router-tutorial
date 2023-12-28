export interface Contact {
  id: string;
  first: string;
  last: string;
  avatar: string;
  twitter: string;
  notes: string;
  favorite: boolean;

  createdAt?: number;
}

export function makeContact(data: Partial<Contact> = {}): Contact {
  return {
    id: data.id || makeContactId(),
    first: data.first || 'First',
    last: data.last || 'Last',
    avatar: data.avatar || 'https://placekitten.com/g/200/200',
    twitter: data.twitter || 'thomasburleson',
    notes: data.notes || 'some notes',
    favorite: data.favorite || false,
    createdAt: data.createdAt || Date.now(),
  };
}

export function makeContactId(): string {
  return Math.random().toString(36).substring(2, 9);
}
