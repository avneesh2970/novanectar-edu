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
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "courses/:courseId",
        element: <CourseDetails />,
      },
      {
        path: "payment/success",
        element: <PaymentSuccess />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
];
