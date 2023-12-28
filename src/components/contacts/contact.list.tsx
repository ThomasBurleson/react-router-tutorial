import { NavLink } from 'react-router-dom';
import { Contact } from '@mindspace/stores';

export type ContactListProps = {
  allContacts: Contact[];
};

export const ContactList: React.FC<ContactListProps> = ({ allContacts }) => {
  return (
    <nav>
      {allContacts?.length ? (
        <ul>
          {allContacts.map((contact) => (
            <li key={contact.id}>
              <NavLink
                to={`/contacts/${contact.id}`}
                className={({ isActive, isPending }) =>
                  isActive ? 'active' : isPending ? 'pending' : ''
                }
              >{`${contact.first} ${contact.last}`}</NavLink>
            </li>
          ))}
        </ul>
      ) : (
        <p>
          <i>No contacts</i>
        </p>
      )}
    </nav>
  );
};
