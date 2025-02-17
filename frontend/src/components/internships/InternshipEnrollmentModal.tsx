/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const InternshipEnrollmentModal = ({
  isEnrollModalOpen,
  setIsEnrollModalOpen,
  selectedDuration,
  setSelectedDuration,
  internship,
}: any) => {
  const [formData, setFormData] = useState<any>({
    name: "",
    email: "",
    phone: "",
    orderType: "internship",
    duration: selectedDuration,
  });
  const [errors, setErrors] = useState<any>({});
  const [touched, setTouched] = useState<any>({});
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  if (error) {
    console.log("error: ", error);
  }
  const validateField = (name: any, value: any) => {
    let error = "";
    switch (name) {
      case "name":
        if (!value.trim()) {
          error = "Name is required";
        } else if (value.trim().length < 2) {
          error = "Name must be at least 2 characters";
        }
        break;
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
          error = "Email is required";
        } else if (!emailRegex.test(value)) {
          error = "Please enter a valid email";
        }
        break;
      case "phone":
        const phoneRegex = /^\d{10}$/;
        if (!value.trim()) {
          error = "Phone number is required";
        } else if (!phoneRegex.test(value.replace(/\D/g, ""))) {
          error = "Please enter a valid 10-digit phone number";
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));

    if (touched[name]) {
      setErrors((prev: any) => ({
        ...prev,
        [name]: validateField(name, value),
      }));
    }
  };

  const handleBlur = (e: any) => {
    const { name, value } = e.target;
    setTouched((prev: any) => ({
      ...prev,
      [name]: true,
    }));
    setErrors((prev: any) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    // Validate all fields
    const newErrors: any = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);

    // If no errors, proceed
    if (Object.keys(newErrors).length === 0) {
      // Handle payment logic here
      handlePayment();
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = resolve;
      document.body.appendChild(script);
    });
  };

  let price;
  if (selectedDuration === "3") {
    price = 299;
  } else if (selectedDuration === "1") {
    price = 99;
  } else if (selectedDuration === "6") {
    price = 1;
  } else {
    throw new Error("Invalid duration");
  }


  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      setError(null);

      // Load Razorpay script
      await loadRazorpayScript();

      // Create order
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/create-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            // courseId: internship.id,
            courseName: internship.title,
            courseTitle: internship.title,
            courseDescription: internship.description,
            courseImage: internship.image || "",
            amount: price,
            // userId: "current-user-id",
            orderType: formData.orderType,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const data = await response.json();

      // Initialize Razorpay payment
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "Novanectar",
        description: `Enrollment for ${internship.title}`,
        order_id: data.orderId,
        notes: data.notes,
        handler: async function (response: any) {
          try {
            // Verify payment
            const verifyResponse = await fetch(
              `${import.meta.env.VITE_API_URL}/api/verify-payment`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              }
            );

            if (!verifyResponse.ok) {
              throw new Error("Payment verification failed");
            }

            // Handle successful payment
            setIsEnrollModalOpen();
            navigate("/payment/success");
            const paymentData = {
              courseData: internship,
              billingDetails: formData,
              invoiceNumber: "INV-2024-001",
              purchaseDate: new Date().toLocaleDateString(),
            };
            navigate("/payment/success", { state: paymentData });
          } catch (error) {
            console.error("Payment verification error:", error);
            setError("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },

        // Updated config for payment methods including UPI
        config: {
          display: {
            blocks: {
              utilities: {
                name: "Pay via UPI",
                instruments: [
                  {
                    method: "upi",
                    flows: ["collect", "qr"],
                  },
                ],
              },
              other: {
                name: "Other Payment Methods",
                instruments: [
                  {
                    method: "card",
                  },
                  {
                    method: "netbanking",
                  },
                  {
                    method: "wallet",
                  },
                ],
              },
            },
            sequence: ["block.utilities", "block.other"],
            preferences: {
              show_default_blocks: true,
            },
          },
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            setError("Payment cancelled");
          },
          confirm_close: true,
          escape: true,
        },
        theme: {
          color: "#3B82F6",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
      setError("Failed to process payment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDurationChange = (e: any) => {
    setSelectedDuration(e.target.value);
    handleChange(e);
  };

  return (
    <AnimatePresence>
      {isEnrollModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full"
          >
            <h2 className="text-2xl font-bold text-blue-900 mb-2">
              Enroll in Internship
            </h2>
            <p className="text-sm text-blue-700 mb-6">
              {selectedDuration}-month {internship?.title_}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter your full name"
                />
                {errors.name && touched.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter your email"
                />
                {errors.email && touched.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter your phone number"
                />
                {errors.phone && touched.phone && (
                  <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                )}
              </div>

              {/* ////////////////////////////start///////////////////////////////////// */}
              <div>
                <label
                  htmlFor="duration"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Select Internship Duration
                </label>
                <select
                  id="duration"
                  name="duration"
                  value={selectedDuration}
                  //   onChange={handleChange}
                  onChange={handleDurationChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="1">1 Month</option>
                  <option value="3">3 Months</option>
                  <option value="6">6 Months</option>
                </select>
                <div className="mt-4 text-sm text-gray-600">
                  Selected Duration:{" "}
                  <span className="font-semibold">
                    {selectedDuration} Month{selectedDuration !== "1" && "s"}
                  </span>
                </div>
              </div>
              {/* ////////////////////////////end///////////////////////////////////// */}

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEnrollModalOpen(false)}
                  className="px-6 py-2 rounded-full bg-gray-200 text-blue-900 font-semibold hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-6 py-2 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
                >
                  {isProcessing ? "Processing..." : "Proceed to Payment"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InternshipEnrollmentModal;
