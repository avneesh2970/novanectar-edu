/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { AnimatedInput } from "./AnimatedInput";
import { contactForm } from "../../api/services";


interface ContactPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactPopup({ isOpen, onClose }: ContactPopupProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<any>();

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const onSubmit = async (data: FormData) => {
    console.log("data: ", data)
    try {
      setLoading(true);
      await contactForm.submitForm(data);
      reset();
    } catch (error) {
      console.log("error in api call:", error);

      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60] backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 15 }}
          className="bg-white bg-opacity-90 backdrop-blur-md rounded-lg shadow-xl p-6 w-full max-w-md relative"
          onClick={(e) => e.stopPropagation()}
        >
          <motion.button
            className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="h-6 w-6" />
          </motion.button>
          <motion.h2
            className="text-2xl font-bold mb-6 text-gray-800"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Contact Us
          </motion.h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <AnimatedInput
              register={register("fullName", {
                required: "Full Name is required",
                minLength: {
                  value: 2,
                  message: "Full Name must be at least 2 characters",
                },
              })}
              type="text"
              placeholder="Your Full Name"
              error={errors.fullName}
            />
            <AnimatedInput
              register={register("course", {
                required: "Course selection is required",
              })}
              type="select"
              placeholder="Select Your Course"
              error={errors.course}
            />
            <AnimatedInput
              register={register("city", {
                required: "City is required",
                minLength: {
                  value: 2,
                  message: "City must be at least 2 characters",
                },
              })}
              type="text"
              placeholder="Your City"
              error={errors.city}
            />
            <AnimatedInput
              register={register("phoneNumber", {
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Phone number must be 10 digits",
                },
              })}
              type="tel"
              placeholder="Your Phone Number"
              error={errors.phoneNumber}
            />
            <AnimatedInput
              register={register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email address",
                },
              })}
              type="email"
              placeholder="Your Email"
              error={errors.email}
            />

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              type="submit"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
  );
}
