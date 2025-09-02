/* eslint-disable @typescript-eslint/no-explicit-any */

import api from "./axios";
import { QueryFormData } from "../types";
import toast from "react-hot-toast";
import axios from "axios";

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

export const bookingForm = {
  submitForm: async (data: any) => {
    try {
      const response = await api.post("/api/book-session", data);
      toast.success("Form submitted successfully");
      return response.data;
    } catch (error) {
      toast.error("error in submitting form");
      console.log("error in booking: ", error);
    }
  },
};

export const updateProfile = {
  submitForm: async (data: any) => {
    try {
      await api.put("/api/auth/update-profile", data, {
        withCredentials: true,
      });

      toast.success("Profile Updated successfully");
    } catch (error: any) {
      toast.error(error.response.data.message || "error in updating profile");
      console.log("error in updating profile: ", error);
    }
  },
};

export const uploadCertificate = {
  submitCertificate: async (formData: FormData) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/upload-certificate`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        // withCredentials: true, // uncomment if your backend uses cookie auth
      })
      return response.data // return data so the component can read { success, ... }
    } catch (error: any) {
      console.log("[v0] error in upload-certificate: ", error)
      toast.error(error?.response?.data?.message || "error in uploading certificate")
      throw error
    }
  },
}
