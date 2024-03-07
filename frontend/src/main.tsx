import "./index.scss";
import { RouteObject, RouterProvider, createBrowserRouter } from 'react-router-dom';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import CoursesPage from './pages/courses/CoursesPage';
import Dashboard from './pages/dashboard/DashboardPage';
import { AuthGuard } from './components/AuthGuard/AuthGuard';
import Settings from './pages/settings/Settings';
import CalendarPage from './pages/calendar/CalendarPage';
import * as React from "react";
import * as ReactDOM from "react-dom";
import CourseViewPage, { courseViewPageLoader } from "./pages/course-view/CourseViewPage";
import Providers from "./providers";

export const ROUTES: RouteObject[] = [
  {
    path: "/",
    element: <AuthGuard />,
  },
  {
    path: "/app",
    element: <AuthGuard />,
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
        path: "courses/:courseId",
        element: <CourseViewPage />,
        loader: courseViewPageLoader,
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

ReactDOM.render(
  <React.StrictMode>
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  </React.StrictMode>,
  document.getElementById("root")
);
