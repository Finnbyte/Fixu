import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouteObject, RouterProvider, createBrowserRouter } from 'react-router-dom';
import Login from './pages/login/Login.tsx';
import Register from './pages/register/Register.tsx';
import AuthenticatedView from './components/AuthenticatedView/AuthenticatedView.tsx';
import Root from './pages/root/Root.tsx';
import Courses from './pages/courses/Courses.tsx';
import Home from './pages/home/Home.tsx';
import "./index.css";

export const ROUTES: RouteObject[] = [
  {
    path: "/",
    element: <Root />,
  },
  {
    path: "/app",
    element: <AuthenticatedView />,
    children: [
      {
        element: <Home />,
        index: true,
      },
      {
        path: "courses",
        element: <Courses />,
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
