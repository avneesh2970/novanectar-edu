import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../store/AuthStore";

interface FormData {
  email: string;
  password: string;
}

export default function LoginForm() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password.length < 6) {
      toast("password must be atleast 6 characters long");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast("Please enter a valid email address");
      return;
    }
    setIsLoading(true);

    try {
      // Simulate API call
      // const response = await axios.post(
      //   "http://localhost:3000/api/auth/login",
      //   { email: formData.email, password: formData.password },
      //   {
      //     withCredentials: true,
      //   }
      // );
      // if (response.data.success) {
      //   toast.success("logged in successfully");
      // }
      const credentials = {
        email: formData.email,
        password: formData.password,
      };
      const result = await login(credentials);
      setFormData({ email: "", password: "" });
      if (result.success) {
        navigate("/"); // or wherever you want to redirect after login
      }
      // navigate("/")
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
    <div className="bg-white/90 border border-blue-500 mt-24 backdrop-blur-sm rounded-3xl p-8 shadow-xl transform transition-all duration-300 hover:shadow-2xl">
      <h1 className="text-2xl font-bold text-center mb-6">Login</h1>

      <div className="text-center text-sm mb-6">
        New to NovaNectar?{" "}
        <Link to="/signup" className="text-blue-600 hover:underline">
          Create an account
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
          {isLoading ? "submitting" : "Login"}
        </button>
      </form>
    </div>
  );
}
