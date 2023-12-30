import * as React from 'react';
import { Navigate, createBrowserRouter } from 'react-router-dom';
import { AppErrorPage } from './app.error';

const ContactsDashboard = React.lazy(() => import('../contacts'));

export const router = createBrowserRouter([
  {
    // descendant routing for lazy-loaded, nested <routes></routes>
    path: '/contacts/*',
    element: (
      <React.Suspense fallback={<>...</>}>
        <ContactsDashboard />
      </React.Suspense>
    ),
    errorElement: <AppErrorPage />,
  },
  {
    path: '*',
    element: <Navigate replace to="/contacts" />,
  },
]);
