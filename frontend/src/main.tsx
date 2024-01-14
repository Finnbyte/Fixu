import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouteObject, RouterProvider, createBrowserRouter } from 'react-router-dom';
import Login from './pages/login/Login.tsx';
import Register from './pages/register/Register.tsx';
import Root from './pages/root/Root.tsx';
import Courses from './pages/courses/Courses.tsx';
import Dashboard from './pages/dashboard/DashboardPage.tsx';
import "./index.scss";
import { AuthGuard } from './components/AuthGuard/AuthGuard.tsx';
import Settings from './pages/settings/Settings.tsx';
import Calendar from './pages/calendar/Calendar.tsx';

export const ROUTES: RouteObject[] = [
  {
    path: "/",
    element: <Root />,
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
        element: <Courses />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "calendar",
        element: <Calendar />,
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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
