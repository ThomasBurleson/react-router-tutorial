import { Route, Routes, useLocation, useNavigation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import { useContacts } from '@mindspace/contacts';
import { ContactSearch, ContactList, ContactDetails, ContactEditor } from '.';
import Welcome from './contact.welcome';

/**
 * Render master-details view for Contacts
 */
export function ContactsDashboard() {
  const location = useLocation();
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
        {/* All routing for Contacts Dashboard */}
        <AnimatePresence mode="wait">
          <Routes key={location.pathname} location={location}>
            <Route index element={<Welcome />} />
            <Route path="new" element={<ContactEditor />} />
            <Route path=":id/edit" element={<ContactEditor />} />
            <Route path=":id" element={<ContactDetails />} />
            <Route path="*" element={<h1>Invalid Route</h1>} />
          </Routes>
        </AnimatePresence>
      </div>
    </>
  );
}
