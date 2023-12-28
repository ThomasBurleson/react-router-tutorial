import {
  ActionFunction,
  Navigate,
  createBrowserRouter,
} from 'react-router-dom';

import { AppErrorPage } from './app.error';

import { onSubmit as onEditSubmit } from '../contacts/contact.editor';
import { ContactsDashboard, ContactDetails, ContactEditor } from '../contacts';

export const router = createBrowserRouter([
  {
    path: '/contacts',
    element: <ContactsDashboard />,
    errorElement: <AppErrorPage />,
    children: [
      {
        path: 'new',
        element: <ContactEditor />,
        action: onEditSubmit as ActionFunction,
      },
      {
        path: ':id',
        element: <ContactDetails />,
      },
      {
        path: ':id/edit',
        element: <ContactEditor />,
        action: onEditSubmit as ActionFunction,
      },
    ],
  },
  {
    path: '/*',
    element: <Navigate replace to="/contacts" />,
  },
]);
