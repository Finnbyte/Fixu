import React from 'react'
import "./index.scss";
import ReactDOM from 'react-dom/client'
import { RouteObject, RouterProvider, createBrowserRouter } from 'react-router-dom';
import Login from './pages/login/Login.tsx';
import Register from './pages/register/Register.tsx';
import CoursesPage from './pages/courses/CoursesPage.tsx';
import Dashboard from './pages/dashboard/DashboardPage.tsx';
import { AuthGuard } from './components/AuthGuard/AuthGuard.tsx';
import Settings from './pages/settings/Settings.tsx';
import CalendarPage from './pages/calendar/CalendarPage.tsx';
import { Provider } from 'react-redux';
import { store } from './store.ts';

export const ROUTES: RouteObject[] = [
  {
    path: "/",
    element: <AuthGuard />,
  },
  {
    path: "/app",
    element: (
      <AuthGuard />
    ),
    children: [
      {
        element: <Dashboard />,
        index: true,
      },
      {
        path: "courses",
        element: <CoursesPage />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "calendar",
        element: <CalendarPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/sign-up",
    element: <Register />,
  },
];

const router = createBrowserRouter(ROUTES);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
