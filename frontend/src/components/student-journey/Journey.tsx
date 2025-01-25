"use client";

import { motion } from "framer-motion";
import journey1 from "../../assets/student-journey/journey1.png";
import journey2 from "../../assets/student-journey/journey2.png";

export default function StudentJourney() {
  return (
    <div className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <motion.h1
          className="text-3xl md:text-4xl font-bold text-center text-blue-900 mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          A Student's Journey at NovaNectar
        </motion.h1>

        {/* Journey Path */}
        <div className="relative">
          {/* Discovery Section */}
          <div className="grid md:grid-cols-2 gap-8 items-center mb-16 group">
            <motion.div
              className="bg-blue-50 p-8 rounded-3xl transition-all duration-300 group-hover:bg-blue-100"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">
                Discovery
              </h2>
              <p className="text-gray-700">
                Begin your journey by exploring our courses, signing up for your
                preferred one, and joining our online webinar to gain deeper
                insights into the program.
              </p>
            </motion.div>
            <motion.div
              className="relative h-64 md:h-80 overflow-hidden rounded-full"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <img
                src={journey1}
                alt="Student exploring courses"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </motion.div>
          </div>

          {/* Curved Arrow */}
          {/* <div
            className="hidden md:block absolute left-1/2 transform -translate-x-1/2 group cursor-pointer"
            style={{ top: "45%", width: "200px", height: "150px" }}
          >
            <svg
              width="100%"
              height="100%"
              className="transform transition-transform duration-300"
            >
              <path
                d="M 20 20 Q 200 130 180 150"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="3"
                strokeDasharray="6,6"
                className="transition-all duration-300 group-hover:stroke-blue-700 group-hover:stroke-[4]"
              />
              <motion.polygon
                points=points="100,40 95,30 105,30"

                fill="#3B82F6"
                className="transition-all duration-300 group-hover:fill-blue-700"
                animate={{
                  x: [0, 5, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
            </svg>
          </div> */}

          {/* Enrolling Section */}
          <div className="grid md:grid-cols-2 gap-8 items-center group">
            <motion.div
              className="order-2 md:order-1 relative h-64 md:h-80 overflow-hidden rounded-full"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <img
                src={journey2}
                alt="Student enrolling in courses"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </motion.div>
            <motion.div
              className="order-1 md:order-2 bg-blue-50 p-8 rounded-3xl transition-all duration-300 group-hover:bg-blue-100"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
            >
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">
                Enrolling
              </h2>
              <p className="text-gray-700">
                Choose from a wide range of projects and assignments, and
                benefit from expert mentorship to secure project approval.
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center mb-16 group">
            <motion.div
              className="bg-blue-50 p-8 rounded-3xl transition-all duration-300 group-hover:bg-blue-100"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">
                Completion Certificate
              </h2>
              <p className="text-gray-700">
                Earn a recognized Completion Certificate upon successfully
                finishing the course, showcasing your achievement and validating
                your skills.
              </p>
            </motion.div>
            <motion.div
              className="relative h-64 md:h-80 overflow-hidden rounded-full"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <img
                src={journey1}
                alt="Student exploring courses"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center group">
            <motion.div
              className="order-2 md:order-1 relative h-64 md:h-80 overflow-hidden rounded-full"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <img
                src={journey2}
                alt="Student enrolling in courses"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </motion.div>
            <motion.div
              className="order-1 md:order-2 bg-blue-50 p-8 rounded-3xl transition-all duration-300 group-hover:bg-blue-100"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
            >
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">
                Get a job!
              </h2>
              <p className="text-gray-700">
                Secure your dream job by gaining hands-on experience through
                practical projects and personalized mentorship, preparing you
                for success in the professional world.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
