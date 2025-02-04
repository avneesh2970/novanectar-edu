// src/router/routes.tsx
import { RouteObject } from "react-router-dom";
import Layout from "../components/Layout";
import { Home, Contact, Courses, NotFound, Book } from "../components/Lazy";
import CourseDetails from "../components/CourseDetails";
import Internships from "../pages/Internships";
import PaymentSuccess from "../pages/PaymentSuccess";

import Signup from "../pages/auth/SignUp";
import Login from "../pages/auth/LogIn";
import AboutUs from "../components/AboutUs/AboutUs";
import InternshipDetail from "../components/internships/InternshipDetail";
import PublicRoute from "../components/auth/PublicRoute";
import PrivateRoute from "../components/auth/PrivateRoute";
import Profile from "../pages/profile/Profile";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminLogin from "../pages/admin/AdminLogin";
import AdminProtectedRoute from "../components/auth/AdminProtectedRoute";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "session-book",
        element: <Book />,
      },
      {
        path: "contact-us",
        element: <Contact />,
      },
      {
        path: "about-us",
        element: <AboutUs />,
      },
      {
        path: "courses",
        element: <Courses />,
      },
      {
        path: "internships",
        element: <Internships />,
      },
      {
        path: "profile",
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
      },
      {
        path: "login",
        element: (
          <PublicRoute>
            <Login />
          </PublicRoute>
        ),
      },
      {
        path: "signup",
        element: (
          <PublicRoute>
            <Signup />
          </PublicRoute>
        ),
      },
      {
        path: "courses/:courseId",
        element: <CourseDetails />,
      },
      {
        path: "internships/:internshipId",
        element: <InternshipDetail />,
      },
      {
        path: "payment/success",
        element: <PaymentSuccess />,
      },
      // {
      //   path: "admin",
      //   element: <AdminLogin />,
      // },
      // {
      //   path: "admin/dashboard",
      //   element: (
      //     <AdminProtectedRoute>
      //       <AdminDashboard />
      //     </AdminProtectedRoute>
      //   ),
      // },

      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
  {
    path: "admin",
    element: <AdminLogin />,
  },
  {
    path: "admin/dashboard",
    element: (
      <AdminProtectedRoute>
        <AdminDashboard />
      </AdminProtectedRoute>
    ),
  },
];
