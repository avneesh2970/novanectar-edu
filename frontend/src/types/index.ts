export interface QueryFormData {
  fullName: string;
  phoneNumber: string;
  email: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  price: number;
  duration: string;
  curriculum: {
    module: string;
    topics: string[];
  }[];
  instructor: {
    name: string;
    bio: string;
    image: string;
  };
  prerequisites: string[];
  learningOutcomes: string[];
}

// types.ts
interface CourseContent {
  title: string;
  lectures: number;
  duration: string;
  content: string[];
}

interface CourseIncludes {
  videoHours: string;
  resources: string;
  codingExercises: string;
  articles: string;
  certificate: string;
  access: string;
}

interface CourseStats {
  learners: string;
  practices: string;
  rating: string;
}

interface CourseData {
  id: string;
  category: string;
  title: string;
  title_: string;
  description: string;
  description_: string;
  image: string;
  features: string[];
  courseIncludes: CourseIncludes;
  stats: CourseStats;
  content: CourseContent[];
  price: number;
  duration: string;
}

export interface CourseSlipProps {
  courseData: CourseData;
}

// declare module 'jspdf-autotable' {
//   import { jsPDF } from 'jspdf';
//   function autoTable(doc: jsPDF, options: any): void;
//   export default autoTable;
// }