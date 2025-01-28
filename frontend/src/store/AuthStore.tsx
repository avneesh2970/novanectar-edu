/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }:any) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/auth/check",
        { withCredentials: true }
      );
      setIsAuthenticated(true);
      setUsername(response.data._doc.firstName + " " + response.data._doc.lastName);
    } catch {
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (credentials:any) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        credentials,
        { withCredentials: true }
      );
      setIsAuthenticated(true);
      setUsername(response.data.firstName + " " + response.data.lastName);
      toast.success("Logged in successfully");
      return { success: response.data.success };
    } catch (error:any) {
      toast.error(error.response?.data?.message || "Login failed");
      return { success: false, error };
    }
  };

///////////////////////////////////////////////////////
const signup = async (credentials:any) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/api/auth/signup",
      credentials,
      { withCredentials: true }
    );
    setIsAuthenticated(true);
    setUsername(response.data.firstName + " " + response.data.lastName);
    toast.success("Logged in successfully");
    return { success: response.data.success };
  } catch (error:any) {
    toast.error(error.response?.data?.message || "Login failed");
    return { success: false, error };
  }
};

  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:3000/api/auth/logout",
        {},
        { withCredentials: true }
      );
      setIsAuthenticated(false);
      setUsername("");
      toast.success("logged out successfully");
      window.location.href = "/login";
    } catch (error) {
      console.log("error in logout: ", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ 
        isAuthenticated, 
        setIsAuthenticated, 
        isLoading, 
        logout, 
        login,
        signup, 
        username 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;