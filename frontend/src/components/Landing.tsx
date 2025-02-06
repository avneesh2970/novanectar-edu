import React, { useState } from "react";
import landing from "../assets/landing.webp";
import { QueryFormData } from "../types";
import { queyForm } from "../api/services";
import { Link } from "react-router-dom";

export default function Landing() {
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const [formData, setFormData] = useState<QueryFormData>({
    fullName: "",
    phoneNumber: "",
    email: "",
  });

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      await queyForm.submitForm(formData);
    } catch (error) {
      console.log("error: ", error);
    } finally {
      setLoading(false);
      setFormData({
        fullName: "",
        phoneNumber: "",
        email: "",
      });
    }
  };
  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${landing})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content */}
      <div className="relative flex flex-col md:flex-row items-center justify-between text-white px-4 md:px-16 py-10 gap-10">
        {/* Left Content */}
        <div className="max-w-lg space-y-6 pt-20 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold">
            Empower adult learners with
            <span className="text-blue-500">In-Demand Skills</span> for
            tomorrow's jobs
          </h2>
          <p className="text-lg pb-8">
            Our platform makes education flexible and convenient, so you can
            achieve your goals wherever and whenever you choose.
          </p>
          <Link
            to="/courses"
            className="px-6 py-3 bg-transparent border border-white text-white font-semibold rounded-lg shadow-md"
          >
            Enroll now for courses
          </Link>
        </div>

        {/* Right Content: Enquiry Form */}
        <form
          onSubmit={submitHandler}
          className="bg-blue-200 mt-20 text-black p-8 rounded-lg shadow-lg w-full max-w-md"
        >
          <h1 className="text-2xl font-bold mb-6">Enquiry Form</h1>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Your Full Name
              </label>
              <input
                type="text"
                id="fullName"
                onChange={handleChange}
                value={formData.fullName}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-1">
                Phone Number
              </label>
              <input
                type="text"
                id="phoneNumber"
                onChange={handleChange}
                value={formData.phoneNumber}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Your Email
              </label>
              <input
                type="text"
                id="email"
                onChange={handleChange}
                value={formData.email}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 px-4 py-2 bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600"
          >
            {loading ? "Loading..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}
