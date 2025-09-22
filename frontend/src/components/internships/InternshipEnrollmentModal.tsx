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
    couponCode: "",
  });
  const [errors, setErrors] = useState<any>({});
  const [touched, setTouched] = useState<any>({});
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCouponApplied, setIsCouponApplied] = useState<boolean>(false);
  const [couponError, setCouponError] = useState<string>("");
  const navigate = useNavigate();
  if (error) {
    console.log("error: ", error);
  }
  // const validCoupons = ["SAVE30", "DISCOUNT30", "INTERN30"];

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

  const validateCoupon = async(couponCode: string) => {
    if (!couponCode.trim()) {
      setCouponError("");
      setIsCouponApplied(false);
      return;
    }

     try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/discount/validate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: couponCode }),
      })

      const data = await response.json()

      if (data.success) {
        setCouponError("")
        setIsCouponApplied(true)
      } else {
        setCouponError(data.message || "Invalid coupon code")
        setIsCouponApplied(false)
      }
    } catch (error) {
      console.log("error: ", error)
      setCouponError("Error validating coupon")
      setIsCouponApplied(false)
    }
    // if (validCoupons.includes(couponCode.toUpperCase())) {
    //   setCouponError("");
    //   setIsCouponApplied(true);
    // } else {
    //   setCouponError("Invalid coupon code");
    //   setIsCouponApplied(false);
    // }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
    if (name === "couponCode") {
      validateCoupon(value);
    }
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

    const newErrors: any = {};
    Object.keys(formData).forEach((key) => {
      if (key !== "couponCode") {
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      }
    });

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
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

  let basePrice;
  if (selectedDuration === "3") {
    // price = 2499;
    basePrice = 3499;
  } else if (selectedDuration === "1") {
    // price = 1499;
    basePrice = 1999;
  } else if (selectedDuration === "6") {
    // price = 4599;
    basePrice = 5999;
    // price = 1;
  } else {
    throw new Error("Invalid duration");
  }
  const discountAmount = isCouponApplied ? Math.round(basePrice * 0.3) : 0;
  const discountedPrice = basePrice - discountAmount;
  const gstRate = 0.18;
  const finalPrice = Math.round(discountedPrice * (1 + gstRate));

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
            amount: finalPrice,
            // userId: "current-user-id",
            orderType: formData.orderType,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            duration: selectedDuration,
            couponCode: isCouponApplied ? formData.couponCode : null,
            discountAmount: discountAmount,
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
          if (!response.razorpay_order_id) {
            console.error("razorpay_order_id is missing!");
          }
          if (!response.razorpay_signature) {
            console.error("razorpay_signature is missing!");
          }
          try {
            setIsVerifying(true);
            setIsProcessing(false);
            // Verify payment
            const verifyResponse = await fetch(
              `${import.meta.env.VITE_API_URL}/api/verify-payment`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  razorpay_order_id: data.orderId,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  email: formData.email,
                }),
              }
            );
            if (!verifyResponse.ok) {
              throw new Error("Payment verification failed");
            }

            // Handle successful payment
            setIsEnrollModalOpen(false);
            // navigate("/payment/success");
            const paymentData = {
              courseData: internship,
              billingDetails: formData,
              invoiceNumber: "INV-2024-001",
              purchaseDate: new Date().toLocaleDateString(),
              duration: selectedDuration,
              couponCode: isCouponApplied ? formData.couponCode : null,
              discountAmount: discountAmount,
              originalPrice: basePrice,
              finalPrice: finalPrice,
            };
            navigate("/payment/success", { state: paymentData });
          } catch (error) {
            console.error("Payment verification error:", error);
            setError("Payment verification failed. Please contact support.");
          } finally {
            setIsVerifying(false);
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
          ondismiss: () => {
            // Only reset processing if not verifying
            if (!isVerifying) {
              setIsProcessing(false);
              setError("Payment cancelled");
            }
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
      setIsProcessing(false);
    }
  };

  const handleDurationChange = (e: any) => {
    setSelectedDuration(e.target.value);
    handleChange(e);
  };

  const getButtonText = () => {
    if (isProcessing) return "Processing Payment...";
    if (isVerifying) return "please wait...";
    return "Proceed to Payment";
  };
  const isLoading = isProcessing || isVerifying;

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
            className="bg-white rounded-3xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-2xl font-bold text-blue-900 mb-2">Enroll in Internship</h2>
            <p className="text-sm text-blue-700 mb-6">
              {selectedDuration}-month {internship?.title_}
            </p>
            {isVerifying ? (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-1">
                  <span className="text-sm text-red-500">please wait! Generating offer letter</span>
                  <svg className="w-5 h-5 text-red-500" viewBox="0 0 120 30" fill="currentColor">
                    <circle cx="15" cy="15" r="15">
                      <animate attributeName="cy" values="15;5;15" dur="0.6s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="60" cy="15" r="15">
                      <animate attributeName="cy" values="15;5;15" dur="0.6s" begin="0.2s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="105" cy="15" r="15">
                      <animate attributeName="cy" values="15;5;15" dur="0.6s" begin="0.4s" repeatCount="indefinite" />
                    </circle>
                  </svg>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={isLoading}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && touched.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={isLoading}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100`}
                    placeholder="Enter your email"
                  />
                  {errors.email && touched.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={isLoading}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100`}
                    placeholder="Enter your phone number"
                  />
                  {errors.phone && touched.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code (Optional)</label>
                  <input
                    type="text"
                    name="couponCode"
                    value={formData.couponCode}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      couponError ? "border-red-500" : isCouponApplied ? "border-green-500" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100`}
                    placeholder="Enter coupon code for 30% discount"
                  />
                  {couponError && <p className="mt-1 text-sm text-red-500">{couponError}</p>}
                  {isCouponApplied && (
                    <p className="mt-1 text-sm text-green-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Coupon applied! 30% discount activated
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                    Select Internship Duration
                  </label>
                  <select
                    id="duration"
                    name="duration"
                    value={selectedDuration}
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

                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex justify-between">
                        <span>Base Price:</span>
                        <span>₹{basePrice}</span>
                      </div>
                      {isCouponApplied && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount (30%):</span>
                          <span>-₹{discountAmount}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>₹{discountedPrice}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>GST (18%):</span>
                        <span>₹{Math.round(discountedPrice * 0.18)}</span>
                      </div>
                      <hr className="my-2" />
                      <div className="flex justify-between font-semibold text-blue-900">
                        <span>Total Amount:</span>
                        <span>₹{finalPrice}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsEnrollModalOpen(false)}
                    disabled={isLoading}
                    className="px-6 py-2 rounded-full bg-gray-200 text-blue-900 font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {getButtonText()}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InternshipEnrollmentModal;
