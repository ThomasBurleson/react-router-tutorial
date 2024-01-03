/* eslint-disable no-restricted-globals */
import { Form, useParams } from 'react-router-dom';
import { Contact, useContactByID } from '@mindspace/contacts';

import { AnimatedPage } from '../animated-page';

export function ContactDetails() {
  const { id } = useParams();
  const [contact, api] = useContactByID(id || '');

  const onDelete = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (contact && confirm('Please confirm you want to delete this record.')) {
      api.delete(contact);
    }
    event.preventDefault();
  };
  const onToggleFavorite = () => {
    if (contact) {
      api.save({ ...contact, favorite: !contact.favorite }, true);
    }
  };

  return contact ? (
    <AnimatedPage>
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
            <Favorite contact={contact} onChangeFavorite={onToggleFavorite} />
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
    </AnimatedPage>
  ) : null;
}

type FavoriteProps = { contact: Contact; onChangeFavorite?: () => void };
export function Favorite({
  contact: { favorite },
  onChangeFavorite,
}: FavoriteProps) {
  onChangeFavorite = onChangeFavorite || (() => {});

  return (
    <button
      type="button"
      name="favorite"
      value={favorite ? 'false' : 'true'}
      aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
      onClick={onChangeFavorite}
    >
      {favorite ? '★' : '☆'}
    </button>
  );
}
