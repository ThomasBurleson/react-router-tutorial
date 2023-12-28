/* eslint-disable no-restricted-globals */
import { Form, useParams } from 'react-router-dom';
import { Contact, useContactByID } from '@mindspace/stores';

export function ContactDetails() {
  const { id } = useParams();
  const [contact, api] = useContactByID(id || '');

  const onDelete = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (contact && confirm('Please confirm you want to delete this record.')) {
      api.delete(contact);
    }
    event.preventDefault();
  };

  return contact ? (
    <div id="contact">
      <div>
        <img
          key={contact.avatar}
          src={contact.avatar || ''}
          alt={contact.twitter}
        />
      </div>

      <div>
        <h1>
          {contact.first || contact.last ? (
            <>
              {contact.first} {contact.last}
            </>
          ) : (
            <i>No Name</i>
          )}{' '}
          <Favorite contact={contact} />
        </h1>

        {contact.twitter && (
          <p>
            <a
              target="_blank"
              href={`https://twitter.com/${contact.twitter}`}
              rel="noreferrer"
            >
              {contact.twitter}
            </a>
          </p>
        )}

        {contact.notes && <p>{contact.notes}</p>}

        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>

          <button onClick={onDelete}>Delete</button>
        </div>
      </div>
    </div>
  ) : null;
}

type FavoriteProps = { contact: Contact };
function Favorite({ contact }: FavoriteProps) {
  // yes, this is a `let` for later
  const favorite = contact.favorite;
  return (
    <Form method="post">
      <button
        name="favorite"
        value={favorite ? 'false' : 'true'}
        aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        {favorite ? '★' : '☆'}
      </button>
    </Form>
  );
}
