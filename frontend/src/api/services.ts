/* eslint-disable @typescript-eslint/no-explicit-any */

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

export const generateCertificate = {
  submitForm: async (data: any) => {
    try {
      return await api.post("/api/get-certificate", { uniqueId: data });
    } catch (error: any) {
      toast.error("error in getting certificate", error);
    }
  },
};
