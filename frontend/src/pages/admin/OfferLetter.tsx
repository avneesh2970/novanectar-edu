/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import axios from "axios";
import { Loader2, Search, X } from "lucide-react";
import toast from "react-hot-toast";

export default function OfferLetter() {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSearch = async () => {
    if (!form.name && !form.email && !form.phone) return;
    try {
      setLoading(true);
      setSearched(true);
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/find-orders`,
        form
      );
      setOrders(data);
    } catch (error) {
      console.error("Search error:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const sendOfferLetter = async (courseId: any, email: any, orderType: any) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/send-offer-letter`,
        { courseId, email, orderType }
      );
      toast.success(response.data.message);
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Failed to send offer letter. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto min-h-screen flex flex-col justify-center">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        🔍 Find Your Orders
      </h2>

      <div className="space-y-4">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter Name"
          className="border border-gray-300 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Enter Email"
          className="border border-gray-300 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <input
          type="text"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Enter Phone"
          className="border border-gray-300 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />

        <button
          onClick={handleSearch}
          disabled={loading || (!form.name && !form.email && !form.phone)}
          className={`w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold px-4 py-3 rounded transition ${
            loading || (!form.name && !form.email && !form.phone)
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-blue-700"
          }`}
        >
          {loading ? (
            <Loader2 className="animate-spin w-5 h-5" />
          ) : (
            <Search className="w-5 h-5" />
          )}
          {loading ? "Searching..." : "Search Orders"}
        </button>
      </div>

      {/* Results */}
      {searched && (
        <div className="mt-8">
          {orders.length > 0 ? (
            <>
              <h3 className="text-xl font-semibold mb-4 text-gray-700">
                📄 Matching Orders
              </h3>
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    onClick={() => setSelectedOrder(order)}
                    className="border p-4 rounded-lg shadow-sm bg-white hover:shadow-md transition cursor-pointer"
                  >
                    <p className="text-gray-800 font-medium">
                      {order.courseName}
                    </p>
                    <p className="text-sm text-gray-600">
                      ₹{order.amount} • {order.status.toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500 mt-6">
              🚫 No matching orders found.
            </p>
          )}
        </div>
      )}

      {/* Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-lg shadow-lg p-6 relative">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold mb-4 text-gray-800">
              {selectedOrder.courseName}
            </h2>
            <div className="space-y-2 text-sm text-gray-700">
              <p>
                <strong>💼 Name:</strong> {selectedOrder.name}
              </p>
              <p>
                <strong>💼 Course Type:</strong> {selectedOrder.orderType}
              </p>
              <p>
                <strong>💼 Course Title:</strong> {selectedOrder.courseTitle}
              </p>
              <p>
                <strong>📅 Duration:</strong> {selectedOrder.duration} month(s)
              </p>
              <p>
                <strong>💳 Amount:</strong> ₹{selectedOrder.amount}
              </p>
              <p>
                <strong>📌 Status:</strong> {selectedOrder.status}
              </p>
              <p>
                <strong>📨 Email:</strong> {selectedOrder.email}
              </p>
              <p>
                <strong>📱 Phone:</strong> {selectedOrder.phone}
              </p>
              <p>
                <strong>🗓️ Ordered At:</strong>{" "}
                {new Date(selectedOrder.createdAt).toLocaleString()}
              </p>
              <div className="text-center">
                <button
                  className={`flex items-center justify-center gap-2 border border-blue-500 text-blue-500 px-4 py-2 rounded-md transition 
    ${
      loading
        ? "opacity-50 cursor-not-allowed"
        : "hover:bg-blue-500 hover:text-white"
    }`}
                  onClick={() =>
                    sendOfferLetter(
                      selectedOrder.courseId,
                      selectedOrder.email,
                      selectedOrder.orderType
                    )
                  }
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Offer Letter"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
