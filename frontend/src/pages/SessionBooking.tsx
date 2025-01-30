import React, { useState } from 'react';

const SessionBooking = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    course: '',
    time: '',
    phoneNumber: '',
    email: ''
  });

  const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white mt-28">
      <h1 className="text-xl font-medium text-center">Attend our One to One Session</h1>

      {/* Why attend section */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-center">Why attend the Session?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {/* Feature 1 */}
          <div className="border border-gray-200 rounded-lg p-4 text-center">
            <div className="w-12 h-12 bg-[#EEF5FF] rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-600 font-bold">1:1</span>
            </div>
            <h3 className="font-medium text-sm mb-2">Personalized Course</h3>
            <p className="text-xs text-gray-600">Every course plan suited to your needs & goals</p>
          </div>

          {/* Feature 2 */}
          <div className="border border-gray-200 rounded-lg p-4 text-center">
            <div className="w-12 h-12 bg-[#EEF5FF] rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-600 text-xl">💬</span>
            </div>
            <h3 className="font-medium text-sm mb-2">Direct Interaction</h3>
            <p className="text-xs text-gray-600">Face to face talk with your mentor</p>
          </div>

          {/* Feature 3 */}
          <div className="border border-gray-200 rounded-lg p-4 text-center">
            <div className="w-12 h-12 bg-[#EEF5FF] rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-600 text-xl">✨</span>
            </div>
            <h3 className="font-medium text-sm mb-2">Clarity and Confidence</h3>
            <p className="text-xs text-gray-600">Get clear direction about your learning path</p>
          </div>
        </div>
      </div>

      {/* Schedule section */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-center mb-4">Schedule of Daily Session</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {[
            { day: '28', name: 'Sunday' },
            { day: '29', name: 'Monday' },
            { day: '30', name: 'Tuesday' },
            { day: '31', name: 'Wednesday' }
          ].map(({ day, name }) => (
            <div key={day} 
                 className="w-16 h-16 bg-[#EEF5FF] rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-blue-100">
              <span className="font-bold text-sm">{day}</span>
              <span className="text-xs text-gray-600">{name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Form section */}
      <div className="mt-8">
        <h2 className="text-sm font-medium text-center mb-6">
          Fill the form to attend one to one session with our mentor
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
          <input
            name="fullName"
            placeholder="Your Full Name"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <input
            name="course"
            placeholder="Select Course"
            value={formData.course}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <input
            name="time"
            placeholder="Time"
            type="time"
            value={formData.time}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <input
            name="phoneNumber"
            placeholder="Phone Number"
            type="tel"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <input
            name="email"
            placeholder="Your Email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Register Now
          </button>
        </form>
      </div>
    </div>
  );
};

export default SessionBooking;