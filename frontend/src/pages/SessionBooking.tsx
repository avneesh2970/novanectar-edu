import type React from "react";
import { useState } from "react";
import CallingIcon from "../components/socialContact/Call";
import WhatsappIcon from "../components/socialContact/Whatsapp";
import { motion } from "framer-motion";
import { bookingForm } from "../api/services";

const SessionBooking = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    domain: "",
    date: "",
    time: "",
    phoneNumber: "",
    email: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("formData: ", formData);
    try {
      bookingForm.submitForm(formData);

      setFormData({
        fullName: "",
        domain: "",
        date: "",
        time: "",
        phoneNumber: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="mx-auto py-6 px-6 sm:px-20 bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-lg pt-28">
      <motion.h1
        className="text-3xl font-bold text-center text-blue-500 mb-8"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        Attend our One-to-One Session
      </motion.h1>

      {/* Why attend section */}
      <motion.div
        className="mt-12"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <h2 className="text-2xl font-semibold text-center text-blue-500 mb-6">
          Why attend the Session?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <motion.div
            className="bg-white border-2 border-blue-200 rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-shadow duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-500 font-bold text-2xl">1:1</span>
            </div>
            <h3 className="font-semibold text-lg mb-3 text-blue-500">
              Personalized Course
            </h3>
            <p className="text-sm text-gray-600">
              Every course plan suited to your unique needs & goals
            </p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            className="bg-white border-2 border-blue-200 rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-shadow duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-500 text-2xl">💬</span>
            </div>
            <h3 className="font-semibold text-lg mb-3 text-blue-600">
              Direct Interaction
            </h3>
            <p className="text-sm text-gray-600">
              Face-to-face talk with your dedicated mentor
            </p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            className="bg-white border-2 border-blue-200 rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-shadow duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-500 text-2xl">✨</span>
            </div>
            <h3 className="font-semibold text-lg mb-3 text-blue-500">
              Clarity and Confidence
            </h3>
            <p className="text-sm text-gray-600">
              Get clear direction about your learning path
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Form section */}
      <motion.div
        className="mt-16"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <h2 className="text-xl font-semibold text-center text-blue-500 mb-8">
          Book Your One-to-One Session with Our Mentor
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto">
          <input
            name="fullName"
            placeholder="Your Full Name"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border-2 border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
            required
          />
          <input
            name="domain"
            placeholder="Your Domain"
            value={formData.domain}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border-2 border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
            required
          />
          <div className="flex gap-4">
            <input
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              className="w-1/2 px-4 py-3 rounded-lg border-2 border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
              required
            />
            <input
              name="time"
              type="time"
              value={formData.time}
              onChange={handleChange}
              className="w-1/2 px-4 py-3 rounded-lg border-2 border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
              required
            />
          </div>
          <input
            name="phoneNumber"
            placeholder="Phone Number"
            type="tel"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border-2 border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
            required
          />
          <input
            name="email"
            placeholder="Your Email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border-2 border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
            required
          />
          <textarea
            name="message"
            placeholder="Add your query"
            value={formData.message}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border-2 border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 h-32 resize-none"
          />
          <motion.button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Register Now
          </motion.button>
        </form>
      </motion.div>

      {/* call icons */}
      <div className="mt-8 flex justify-center space-x-4">
        <CallingIcon />
        <WhatsappIcon />
      </div>
    </div>
  );
};

export default SessionBooking;
