/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Link, redirect, useParams } from 'react-router-dom';
import { useContactByID, snapshot, Contact } from '@mindspace/stores';

type ActionParams = {
  request: any;
  params: Record<string, string>;
};

/**
 * Intercept post action, save with Store and redirect to contact details
 *
 * Without JavaScript, when a form is submitted, the browser will create
 * FormData and set it as the body of the request when it sends it to the
 * server.
 *
 * As mentioned before, React Router prevents that and sends the request
 * to your action instead, including the FormData.
 *
 */
export async function onSubmit({ request, params }: ActionParams) {
  const formData = await request.formData();
  const contact = {
    ...Object.fromEntries(formData),
    id: params.id === 'new' ? undefined : params.id,
  } as Contact;

  const api = snapshot();
  const saved = await api.save(contact);

  return redirect(`/contacts/${saved.id}`);
}

/**
 * Contact Editor
 */
export function ContactEditor() {
  const { id } = useParams();
  const [contact] = useContactByID(id || 'new');

  return contact ? (
    <Form method="post" id="contact-form">
      <p>
        <span>Name</span>
        <input
          placeholder="First"
          aria-label="First name"
          type="text"
          name="first"
          defaultValue={contact.first}
        />
        <input
          placeholder="Last"
          aria-label="Last name"
          type="text"
          name="last"
          defaultValue={contact.last}
        />
      </p>
      <label>
        <span>Twitter</span>
        <input
          type="text"
          name="twitter"
          placeholder="@jack"
          defaultValue={contact.twitter}
        />
      </label>
      <label>
        <span>Avatar URL</span>
        <input
          placeholder="https://example.com/avatar.jpg"
          aria-label="Avatar URL"
          type="text"
          name="avatar"
          defaultValue={contact.avatar}
        />
      </label>
      <label>
        <span>Notes</span>
        <textarea name="notes" defaultValue={contact.notes} rows={6} />
      </label>
      <p>
        <button type="submit">Save</button>
        <Link to={`/contacts/${id}`}>
          <button type="button">Cancel</button>
        </Link>
      </p>
    </Form>
  ) : null;
}
