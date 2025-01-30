import { useState } from "react";
import { Link } from "react-router-dom";

import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export default function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password.length < 6) {
      toast.error("password must be greater that 6 character");
      return;
    }
    if (formData.firstName.length < 2) {
      toast.error("name must be atleast 2 character");
      return;
    }
    if (formData.lastName.length < 2) {
      toast.error("name must be atleast 2 character");
      return;
    }
    if (formData.email.trim() === "") {
      toast.error("must have email");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast("Please enter a valid email address");
      return;
    }
    setIsLoading(true);

    try {
      const credentials = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      };
      const result = await signup(credentials);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
      });
      if (result.success) {
        navigate("/");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log("error is : ", error);
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="bg-white/90 border border-blue-500 mt-28 backdrop-blur-sm rounded-3xl p-8 shadow-xl transform transition-all duration-300 hover:shadow-2xl">
      <h1 className="text-2xl font-bold text-center mb-6">Create an account</h1>

      <div className="text-center text-sm mb-6">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 hover:underline">
          Login
        </Link>
      </div>

      {/* Social Login Buttons */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <button className="flex items-center justify-center gap-2 p-2 border rounded-lg hover:bg-gray-50 transition-colors">
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google"
            className="w-5 h-5"
          />
          Google
        </button>
        <button className="flex items-center justify-center gap-2 p-2 border rounded-lg hover:bg-gray-50 transition-colors">
          <img
            src="https://www.facebook.com/favicon.ico"
            alt="Facebook"
            className="w-5 h-5"
          />
          Facebook
        </button>
      </div>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">or</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="firstName"
            placeholder="First name"
            required
            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            onChange={handleChange}
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            required
            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            onChange={handleChange}
          />
        </div>

        <input
          type="email"
          name="email"
          placeholder="E-mail"
          required
          className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          onChange={handleChange}
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full p-3 rounded-lg bg-blue-900 text-white font-medium hover:bg-blue-800 focus:ring-4 focus:ring-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </button>
      </form>
    </div>
  );
}
