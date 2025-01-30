// src/api/services/authService.js
import api from "./axios";
import { QueryFormData } from "../types";
import toast from "react-hot-toast";

export const queyForm = {
  submitForm: async (data: QueryFormData) => {
    try {
      const response = await api.post("/api/query-form", data);
      toast.success("Form submitted successfully");
      return response.data;
    } catch (error) {
      console.log("error in query-form: ", error);
      toast.error("error in submitting query");
    }
  },
};

export const contactForm = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  submitForm: async (data: any) => {
    try {
      const response = await api.post("/api/contacts", data);
      toast.success("Form submitted successfully");
      return response.data;
    } catch (error) {
      toast.error("error in submitting form");
      console.log("error in query-form: ", error);
    }
  },
};

export const userMessageForm = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  submitForm: async (data: any) => {
    try {
      const response = await api.post("/api/user-message", data);
      toast.success("Form submitted successfully");
      return response.data;
    } catch (error) {
      toast.error("error in submitting form");
      console.log("error in query-form: ", error);
    }
  },
};

export const updateProfile = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  submitForm: async (data: any) => {
    try {
      const dataa = await api.put("/api/auth/update-profile", data, {
        withCredentials: true,
      });
      console.log("result: ", dataa);
      toast.success("Profile Updated successfully");
    } catch (error) {
      toast.error("error in updating profile");
      console.log("error in updating profile: ", error);
    }
  },
};
