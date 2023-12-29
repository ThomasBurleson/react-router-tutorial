import { Link } from 'react-router-dom';
import { useContacts } from '@mindspace/contacts';
import { useDebounceCallback } from '../../hooks';

export const ContactSearch = () => {
  const vm = useContacts();
  const searchWithDebounce = useDebounceCallback<string>(
    vm.loadAll,
    vm.searchQuery,
    300
  );

  return (
    <div>
      <form>
        <input
          id="q"
          name="q"
          defaultValue={vm.searchQuery}
          aria-label="Search contacts"
          placeholder="Search"
          type="search"
          className={vm.isLoading ? 'loading' : ''}
          onChange={(e) => searchWithDebounce(e.target.value)}
        />
        <div id="search-spinner" aria-hidden hidden={!vm.isLoading} />
        <div className="sr-only" aria-live="polite"></div>
      </form>
      <Link to="/contacts/new">
        <button type="button">New</button>
      </Link>
    </div>
  );
};
