import { Link } from 'react-router-dom';
import { useContacts } from '@mindspace/contacts';

export const ContactSearch = () => {
  const vm = useContacts();

  return (
    <div>
      <input
        id="q"
        name="q"
        defaultValue={vm.searchQuery}
        aria-label="Search contacts"
        placeholder="Search"
        type="search"
        onChange={(e) => vm.loadAll(e.target.value)}
      />
      <div id="search-spinner" aria-hidden hidden={true} />
      <div className="sr-only" aria-live="polite"></div>

      <Link to="/contacts/new">
        <button type="button">New</button>
      </Link>
    </div>
  );
};
