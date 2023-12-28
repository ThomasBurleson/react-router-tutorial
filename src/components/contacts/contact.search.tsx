import { Link } from 'react-router-dom';

export const ContactSearch = () => {
  return (
    <div>
      <form id="search-form" role="search">
        <input
          id="q"
          name="q"
          aria-label="Search contacts"
          placeholder="Search"
          type="search"
        />
        <div id="search-spinner" aria-hidden hidden={true} />
        <div className="sr-only" aria-live="polite"></div>
      </form>

      <Link to="/contacts/new">
        <button type="button">New</button>
      </Link>
    </div>
  );
};
