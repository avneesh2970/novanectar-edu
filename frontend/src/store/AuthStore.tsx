/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

const AuthContext = createContext<any>(null);

// 6 hours in milliseconds
const SESSION_DURATION = 6 * 60 * 60 * 1000;

export const AuthProvider = ({ children }: any) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    const sessionData = sessionStorage.getItem("authData");
    if (sessionData) {
      const { expiresAt } = JSON.parse(sessionData);
      return new Date().getTime() < expiresAt;
    }
    return false;
  });
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const response = await api.get("/api/auth/check", {
        withCredentials: true,
      });
      setIsAuthenticated(true);
      setUsername(
        response.data._doc.firstName + " " + response.data._doc.lastName
      );
    } catch {
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const adminLogin = (userId:any, password:any) => {
    if (
      userId === import.meta.env.VITE_ADMIN_USER &&
      password === import.meta.env.VITE_ADMIN_PASSWORD
    ) {
      setIsAdminAuthenticated(true);
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('authData');
  };

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAdminAuthenticated) {
      const expiresAt = new Date().getTime() + SESSION_DURATION;
      sessionStorage.setItem("authData", JSON.stringify({ expiresAt }));
    } else {
      sessionStorage.removeItem("authData");
    }
  }, [isAdminAuthenticated]);

  const getUser = async () => {
    try {
      const response = await api.get("/api/auth/getUser", {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.log("error in get user  ", error);
    }
  };

  const getAllUsers = async () => {
    try {
      const response = await api.get("/api/auth/get-all-users", {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.log("error in get all user  ", error);
    }
  };

  const login = async (credentials: any) => {
    try {
      const response = await api.post("/api/auth/login", credentials, {
        withCredentials: true,
      });
      setIsAuthenticated(true);
      setUsername(response.data.firstName + " " + response.data.lastName);
      toast.success("Logged in successfully");
      return { success: response.data.success };
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
      return { success: false, error };
    }
  };

  const signup = async (credentials: any) => {
    try {
      const response = await api.post("/api/auth/signup", credentials, {
        withCredentials: true,
      });
      setIsAuthenticated(true);
      setUsername(response.data.firstName + " " + response.data.lastName);
      toast.success("Logged in successfully");
      return { success: response.data.success };
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
      return { success: false, error };
    }
  };

  const logout = async () => {
    try {
      await api.post("/api/auth/logout", {}, { withCredentials: true });
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
        getUser,
        getAllUsers,
        signup,
        username,
        adminLogin,
        adminLogout,
        isAdminAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
