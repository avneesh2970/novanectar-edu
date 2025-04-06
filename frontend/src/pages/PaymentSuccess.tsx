import { useLocation, useNavigate } from "react-router-dom";
import CourseInvoice from "../components/CourseInvoice";

export default function PaymentSuccess() {
  const location = useLocation();
  const paymentData = location.state;
  const navigate = useNavigate();
  
  function generateInvoiceNumber() {
    const randomNum = Math.floor(Math.random() * 1000); // Generates a number between 0 and 999
    const formattedNum = String(randomNum).padStart(3, "0"); // Ensures it's always three digits
    return `INV-2025-${formattedNum}`;
  }
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-100 to-blue-400">
      <div className="text-center bg-white shadow-lg rounded-lg p-6 w-11/12 sm:w-2/3 md:w-1/2 lg:w-1/3 animate-fade-in">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-green-500 mx-auto animate-bounce"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h1 className="text-2xl md:text-3xl font-semibold mt-4 text-gray-800">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mt-2">
          Thank you for your payment. Your transaction was completed
          successfully.
        </p>
        {/* <div>
          <h1>Payment Success</h1>
          <p>Amount: {paymentData?.amount}</p>
          <p>Transaction ID: {paymentData?.transactionId}</p>
          <p>Status: {paymentData?.status}</p>
        </div> */}

        <CourseInvoice
          courseData={paymentData?.courseData}
          billingDetails={paymentData?.billingDetails}
          invoiceNumber={generateInvoiceNumber()}
          purchaseDate={new Date().toLocaleDateString()}
          duration={paymentData?.duration}
        />
        <button
          onClick={() => navigate("/")}
          className="mt-6 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
}
