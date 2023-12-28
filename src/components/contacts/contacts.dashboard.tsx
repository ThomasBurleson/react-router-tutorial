import { Outlet, useNavigation } from 'react-router-dom';

import { useContacts } from '@mindspace/contacts';
import { ContactSearch, ContactList } from '.';

/**
 * Render master-details view for Contacts
 */
export function ContactsDashboard() {
  const { allContacts } = useContacts();
  const navigation = useNavigation();

  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        <ContactSearch />
        <ContactList allContacts={allContacts} />
      </div>
      <div
        id="detail"
        className={navigation.state === 'loading' ? 'loading' : ''}
      >
        <Outlet />
      </div>
    </>
  );
}
