import { Outlet } from 'react-router-dom';

import { useContacts } from '@mindspace/stores';
import { ContactSearch, ContactList } from '.';

/**
 * Render master-details view for Contacts
 */
export function ContactsDashboard() {
  const { allContacts, isLoading } = useContacts();

  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        <ContactSearch />
        <ContactList allContacts={allContacts} />
      </div>
      <div id="detail" className={isLoading ? 'loading' : ''}>
        <Outlet />
      </div>
    </>
  );
}
