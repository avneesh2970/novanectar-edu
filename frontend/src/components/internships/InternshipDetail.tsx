/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { internshipData } from "../../data/courses";
import InternshipEnrollmentModal from "./InternshipEnrollmentModal";

const InternshipDetail = () => {
  const { internshipId } = useParams();
  const navigate = useNavigate();
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState("6");

  const durationOptions = [
    {
      months: "1",
      price: "99",
      originalPrice:"199",
      highlight: "Perfect for quick skill development",
    },
    {
      months: "3",
      price: "299",
      originalPrice:"599",
      highlight: "Ideal for in-depth learning",
    },
    {
      months: "6",
      price: "699",
      originalPrice:"1399",
      highlight: "Complete professional experience",
    },
  ];

  const internshipJourney = [
    {
      title: "Enrollment Process",
      description:
        "Choose your preferred internship duration and complete the enrollment process",
      icon: "🚀",
    },
    {
      title: "Offer Letter",
      description:
        "Receive your internship offer letter within 24 hours of successful enrollment",
      icon: "📝",
    },
    {
      title: "Introduction Session",
      description:
        "Comprehensive orientation about the program and technologies",
      icon: "👥",
    },
    {
      title: "Elementary Task",
      description:
        "Complete mandatory fundamental assignments to demonstrate basic skills",
      icon: "✨",
    },
    {
      title: "Live Projects",
      description: "Work on real-world projects with experienced developers",
      icon: "💻",
    },
    {
      title: "Certification & LOR",
      description:
        "Earn your certificates and performance-based recommendation letter",
      icon: "🏆",
    },
    {
      title: "Career Growth",
      description:
        "Performance-based stipend and opportunity for full-time position",
      icon: "📈",
    },
  ];

  const handleSelectedInternship = (month: any) => {
    setSelectedDuration(month);
    setIsEnrollModalOpen(true);
  };

  const internship = internshipData.find(
    (course) => course.id === internshipId
  );
  // internshipData.find((intern) => {
  //   console.log("test", intern.id);
  //   console.log("testpp", internshipId);
  // });
  if (!internship) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Internship Not Found</h2>
          <button
            onClick={() => navigate("/internships")}
            className="text-blue-500 hover:underline"
          >
            Back to Internships
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-700 mb-6">
            {internship.title_}
          </h1>
          <p className="text-xl sm:text-2xl text-blue-500 max-w-3xl mx-auto">
            Transform your career with hands-on experience in Python
            development. Learn, build, and grow with industry experts.
          </p>
        </div>

        {/* Duration Options */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-blue-500 mb-10 text-center">
            Choose Your Internship Duration
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {durationOptions.map((option, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.03 }}
                className={`shadow-sm shadow-blue-500 rounded-2xl cursor-pointer transition-all ${
                  selectedDuration === option.months
                    ? "bg-blue-100 border-2 border-blue-500"
                    : "bg-white border-2 border-gray-200 hover:border-blue-300"
                }`}
                onClick={() => handleSelectedInternship(option.months)}
              >
                <div className="text-center bg-white rounded-lg shadow-lg p-8 transform transition-transform duration-300 hover:scale-105 hover:border-2 hover:border-blue-500">
                  <h3 className="text-2xl font-bold text-blue-500 mb-4">
                    {option.months} Month Internship
                  </h3>

                  {/* Discount Badge */}
                  <div className="bg-red-500 text-white text-sm font-semibold px-3 py-1 rounded-full inline-block mb-4">
                    50% OFF
                  </div>

                  {/* Original Price with Strikethrough */}
                  <p className="text-lg text-gray-400 line-through mb-2">
                    ₹{option.originalPrice} INR
                  </p>

                  {/* Discounted Price */}
                  <p className="text-3xl font-extrabold text-blue-600 mb-6">
                    ₹{option.price}{" "}
                    <span className="text-sm font-normal text-blue-400">
                      INR
                    </span>
                  </p>

                  {/* Highlight */}
                  <p className="text-lg text-blue-500 mb-6">
                    {option.highlight}
                  </p>

                  {/* Enroll Button */}
                  <button className="w-full mt-4 px-8 py-2 border border-blue-500 rounded-lg text-blue-600 font-semibold hover:bg-blue-50 transition-colors duration-300">
                    ENROLL
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Journey Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-blue-500 mb-10 text-center">
            Your Internship Journey
          </h2>
          <div className="relative">
            <div className="absolute left-8 inset-y-0 w-0.5 bg-blue-200 hidden md:block"></div>
            {internshipJourney.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col md:flex-row mb-8 relative"
              >
                <div className="md:w-32 flex-shrink-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl z-10">
                    {step.icon}
                  </div>
                </div>
                <div className="mt-4 md:mt-0 md:ml-8 bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex-grow">
                  <h3 className="text-xl font-semibold text-blue-500 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-blue-500">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-20 bg-blue-50 p-8 rounded-3xl">
          <h2 className="text-3xl font-bold text-blue-500 mb-10 text-center">
            What You'll Get
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h3 className="text-2xl font-bold text-blue-500 mb-6">
                Performance Benefits
              </h3>
              <ul className="space-y-4">
                <li className="flex items-center text-lg text-blue-700">
                  <span className="mr-4 text-2xl">💰</span>
                  Performance-based stipend
                </li>
                <li className="flex items-center text-lg text-blue-500">
                  <span className="mr-4 text-2xl">🎯</span>
                  Full-time job opportunity
                </li>
                <li className="flex items-center text-lg text-blue-500">
                  <span className="mr-4 text-2xl">📈</span>
                  Career growth mentorship
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h3 className="text-2xl font-bold text-blue-500 mb-6">
                Learning Benefits
              </h3>
              <ul className="space-y-4">
                <li className="flex items-center text-lg text-blue-500">
                  <span className="mr-4 text-2xl">💻</span>
                  Real project experience
                </li>
                <li className="flex items-center text-lg text-blue-500">
                  <span className="mr-4 text-2xl">🏆</span>
                  Industry certification
                </li>
                <li className="flex items-center text-lg text-blue-500">
                  <span className="mr-4 text-2xl">📝</span>
                  Letter of recommendation
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-blue-100 p-8 sm:p-12 rounded-3xl">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-blue-500">
            Ready to Begin Your Journey?
          </h2>
          <p className="mb-8 text-xl sm:text-2xl text-blue-500">
            Start your professional growth with our {selectedDuration}-month
            internship program
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            // onClick={() => setIsEnrollModalOpen(true)}
            onClick={() => handleSelectedInternship("6")}
            className="bg-blue-500 text-white px-12 py-4 rounded-full font-bold text-xl sm:text-2xl hover:bg-blue-500 transition-colors"
          >
            Apply Now
          </motion.button>
        </div>
      </div>

      {/* Enrollment Modal */}
      <InternshipEnrollmentModal
        isEnrollModalOpen={isEnrollModalOpen}
        setIsEnrollModalOpen={setIsEnrollModalOpen}
        selectedDuration={selectedDuration}
        setSelectedDuration={setSelectedDuration}
        internship={internship}
      />
    </div>
  );
};

export default InternshipDetail;
