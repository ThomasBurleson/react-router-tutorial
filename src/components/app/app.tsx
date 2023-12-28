import { useEffect, useState } from 'react';
import { getContacts, Contact } from 'src/stores/_api';

import '../styles.css';

export function App() {
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    getContacts().then((data) => setContacts(data));
  }, []);

  return <div>Num Contacts = {contacts.length}</div>;
}
