import { useState } from "react";
import { contactForm } from "../api/services";

export default function Contact() {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    course: "",
    city: "",
    phoneNumber: "",
    email: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await contactForm.submitForm(formData);
    } catch (error) {
      console.log("error in contact form: ", error);
    } finally {
      setLoading(false);
      setFormData({
        fullName: "",
        course: "",
        city: "",
        phoneNumber: "",
        email: "",
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-3xl mt-8 font-semibold text-center mb-8">
        Contact Us
      </h2>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Side - Contact Info */}
        <div className="bg-blue-50 rounded-lg p-6">
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Enquiry</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600">📞</span>
                </div>
                <div>
                  <p>+91 89788 91703</p>
                  <p>+91 89788 91705</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600">✉️</span>
                </div>
                <p>info@novanectar.co.in</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600">📍</span>
                </div>
                <p>GMS Road Dehradun Uttarakhand, India</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Timings</h3>
            <div className="space-y-2">
              <p>Monday to Friday - 8:00 am to 8:00 pm</p>
              <p>Saturday to Sunday - 9:00 am to 7:00 pm</p>
            </div>
          </div>
        </div>

        {/* Right Side - Contact Form */}
        <div className="bg-blue-50 rounded-lg p-8 border shadow-2xl shadow-blue-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                name="fullName"
                placeholder="Your Full Name"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full p-2 rounded border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <select
                name="course"
                value={formData.course}
                onChange={handleChange}
                className="w-full p-2 rounded border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Please choose an option</option>
                <option value="python">Python Developer</option>
                <option value="web">Web Development</option>
                <option value="data">Data Analytics</option>
                <option value="ai">Artificial Intelligence</option>
                <option value="java">Java Programming</option>
                <option value="c/c++">c/c++</option>
                <option value="graphicDesign">Graphic Design</option>
              </select>
            </div>

            <div>
              {/* <select
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full p-2 rounded border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Your City</option>
                <option value="dehradun">Dehradun</option>
                <option value="delhi">Delhi</option>
                <option value="mumbai">Mumbai</option>
              </select> */}
              <input
                type="text"
                name="city"
                placeholder="address"
                value={formData.city}
                onChange={handleChange}
                className="w-full p-2 rounded border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <input
                type="tel"
                name="phoneNumber"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full p-2 rounded border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <input
                type="email"
                name="email"
                placeholder="Your Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 rounded border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-800 text-white py-2 rounded hover:bg-blue-700 transition-colors"
            >
              {loading ? "loading..." : "Submit"}
            </button>
          </form>
        </div>
      </div>

      {/* Map Section */}
      <div className="mt-8 rounded-lg overflow-hidden h-[400px]">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3444.5077874790586!2d78.00147847357414!3d30.30807115033991!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39092be94375e729%3A0xc160311fe8cb82d6!2sNovaNectar%20Services%20Pvt.%20Ltd.!5e0!3m2!1sen!2sin!4v1735820280880!5m2!1sen!2sin"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}
