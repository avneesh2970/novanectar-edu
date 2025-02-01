import type React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
// import { useAuth } from "../hooks/useAuth"

interface EnrollmentStats {
  _id: string;
  count: number;
  totalAmount: number;
}

interface Enrollment {
  _id: string;
  courseId: string;
  courseName?: string;
  courseTitle?: string;
  amount: number;
  createdAt: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  orderType: string;
  status: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
}

interface QuerySubmission {
  _id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  createdAt: string;
}

interface ContactSubmission {
  _id: string;
  fullName: string;
  course: string;
  city: string;
  phoneNumber: string;
  email: string;
  createdAt: string;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<EnrollmentStats[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [queries, setQueries] = useState<QuerySubmission[]>([]);
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [clientMessages, setClientMessages] = useState<any[]>([]);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [orderType, setOrderType] = useState("");
  //   const { user } = useAuth()

  useEffect(() => {
    fetchStats();
    fetchEnrollments();
    fetchQueries();
    fetchContacts();
    fetchClientMessages();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/enrollment-stats`,
        {
          withCredentials: true,
        }
      );
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchEnrollments = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/filtered-enrollments`,
        {
          params: { startDate, endDate, orderType },
          withCredentials: true,
        }
      );
      console.log("ress: ", response.data)
      setEnrollments(response.data);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
    }
  };

  const fetchQueries = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/all-queries`,
        {
          withCredentials: true,
        }
      );
      setQueries(response.data);
    } catch (error) {
      console.error("Error fetching queries:", error);
    }
  };

  const fetchContacts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/all-contacts`,
        {
          withCredentials: true,
        }
      );
      setContacts(response.data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  const fetchClientMessages = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/all-user-messages`
      );
      setClientMessages(response.data.data);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("error in fetching clientMessages: ", error);
    }
  };

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEnrollments();
  };

  //   if (!user || user.role !== "admin") {
  //     return <div>Access Denied</div>
  //   }

  return (
    <div className="container mx-auto px-4 py-28">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Enrollment Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.map((stat) => (
            <div key={stat._id} className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">{stat._id}</h3>
              <p>Total Enrollments: {stat.count}</p>
              <p>Total Revenue: Rs{stat.totalAmount.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Filtered Enrollments</h2>
        <form onSubmit={handleFilter} className="mb-4 flex flex-wrap gap-4">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded px-2 py-1"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded px-2 py-1"
          />
          <select
            value={orderType}
            onChange={(e) => setOrderType(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="">All Types</option>
            <option value="course">Course</option>
            <option value="internship">Internship</option>
          </select>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Filter
          </button>
        </form>

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Course/Internship ID</th>
              <th className="border p-2">Student</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Type</th>
              <th className="border p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.map((enrollment) => (
              <tr key={enrollment._id}>
                <td className="border p-2">{enrollment.courseId}</td>
                <td className="border p-2">
                  {enrollment.name}
                  <br />
                  <span className="text-sm text-gray-600">
                    {enrollment.email}
                  </span>
                  <br />
                  <span className="text-sm text-gray-600">
                    {enrollment.phone}
                  </span>
                </td>
                <td className="border p-2">Rs{enrollment.amount.toFixed(2)}</td>
                <td className="border p-2">
                  {new Date(enrollment.createdAt).toLocaleDateString()}
                </td>
                <td className="border p-2">{enrollment.orderType}</td>
                <td className="border p-2">{enrollment.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Query Form Submissions</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Full Name</th>
              <th className="border p-2">Phone Number</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {queries.map((query) => (
              <tr key={query._id}>
                <td className="border p-2">{query.fullName}</td>
                <td className="border p-2">{query.phoneNumber}</td>
                <td className="border p-2">{query.email}</td>
                <td className="border p-2">
                  {new Date(query.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">
          Contact Form Submissions
        </h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Full Name</th>
              <th className="border p-2">Course</th>
              <th className="border p-2">City</th>
              <th className="border p-2">Phone Number</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact._id}>
                <td className="border p-2">{contact.fullName}</td>
                <td className="border p-2">{contact.course}</td>
                <td className="border p-2">{contact.city}</td>
                <td className="border p-2">{contact.phoneNumber}</td>
                <td className="border p-2">{contact.email}</td>
                <td className="border p-2">
                  {new Date(contact.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">
          Client Messages Submissions
        </h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Contact</th>
              <th className="border p-2">Subject</th>
              <th className="border p-2">Message</th>
              <th className="border p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {clientMessages.map((message, idx) => (
              <tr key={idx}>
                <td className="border p-2">{message.name}</td>
                <td className="border p-2">{message.email}</td>
                <td className="border p-2">{message.contact}</td>
                <td className="border p-2">{message.subject}</td>
                <td className="border p-2">{message.message}</td>
                <td className="border p-2">
                  {new Date(message.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
