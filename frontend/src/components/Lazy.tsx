import { lazy } from 'react';

// Lazy load components
export const Home = lazy(() => import('../pages/Home'));
export const Book = lazy(() => import('../pages/SessionBooking'));
export const NotFound = lazy(() => import('../pages/NotFound'));
export const Contact = lazy(() => import('../pages/Contact'));
export const Courses = lazy(() => import('../pages/Courses'));
