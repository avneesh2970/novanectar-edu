/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";

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
  const [bookings, setBookings] = useState<any>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [orderType, setOrderType] = useState("");
  const [queryFilter, setQueryFilter] = useState("");
  const [contactFilter, setContactFilter] = useState("");
  const [bookingFilter, setBookingFilter] = useState("");

  useEffect(() => {
    fetchStats();
    fetchEnrollments();
    fetchQueries();
    fetchContacts();
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const fetchBookings = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/get-bookings`,
        {
          withCredentials: true,
        }
      );
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEnrollments();
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Filtered Enrollments", 14, 15);

    const tableColumn = [
      "ID",
      "User Name",
      "Student Name",
      "Amount",
      "Date",
      "Type",
      "Status",
    ];
    const tableRows = enrollments.map((enrollment: any) => [
      enrollment.courseId,
      `${enrollment.userId.firstName} ${enrollment.userId.lastName}`,
      enrollment.name,
      `$${enrollment.amount.toFixed(2)}`,
      new Date(enrollment.createdAt).toLocaleDateString(),
      enrollment.orderType,
      enrollment.status,
    ]);
    (doc as any).autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 8, cellPadding: 1.5, overflow: "linebreak" },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 30 },
        2: { cellWidth: 30 },
        3: { cellWidth: 20 },
        4: { cellWidth: 25 },
        5: { cellWidth: 25 },
        6: { cellWidth: 20 },
      },
    });

    doc.save("filtered_enrollments.pdf");
  };

  const exportToCSV = () => {
    const csvContent = [
      // CSV header
      [
        "Internship ID",
        "User Name",
        "Logged In Email",
        "Student Name",
        "Student Email",
        "Student Phone",
        "Amount",
        "Date",
        "Type",
        "Status",
      ],
      // CSV data rows
      ...enrollments.map((enrollment: any) => [
        enrollment.courseId,
        `${enrollment.userId.firstName} ${enrollment.userId.lastName}`,
        enrollment.userId.email,
        enrollment.name,
        enrollment.email,
        enrollment.phone,
        enrollment.amount.toFixed(2),
        new Date(enrollment.createdAt).toLocaleDateString(),
        enrollment.orderType,
        enrollment.status,
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob(["\ufeff" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "filtered_enrollments.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const filteredQueries = queries.filter(
    (query) =>
      query.fullName.toLowerCase().includes(queryFilter.toLowerCase()) ||
      query.email.toLowerCase().includes(queryFilter.toLowerCase()) ||
      query.phoneNumber.includes(queryFilter)
  );

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.fullName.toLowerCase().includes(contactFilter.toLowerCase()) ||
      contact.email.toLowerCase().includes(contactFilter.toLowerCase()) ||
      contact.phoneNumber.includes(contactFilter) ||
      contact.course.toLowerCase().includes(contactFilter.toLowerCase()) ||
      contact.city.toLowerCase().includes(contactFilter.toLowerCase())
  );

  const filteredBookings = bookings.filter(
    (bookings: any) =>
      bookings.fullName.toLowerCase().includes(bookingFilter.toLowerCase()) ||
      bookings.domain.toLowerCase().includes(bookingFilter.toLowerCase()) ||
      bookings.date.includes(bookingFilter) ||
      bookings.email.toLowerCase().includes(bookingFilter.toLowerCase()) ||
      bookings.message.toLowerCase().includes(bookingFilter.toLowerCase()) ||
      bookings.phoneNumber
        .toLowerCase()
        .includes(bookingFilter.toLowerCase()) ||
      bookings.time.toLowerCase().includes(bookingFilter.toLowerCase())
  );

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
              <p>Total Revenue: ${stat.totalAmount.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* filter contact */}
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

        <button
          onClick={generatePDF}
          className="bg-green-500 text-white px-4 py-2 rounded mb-4"
        >
          Download Filtered Enrollments PDF
        </button>
        <button
          onClick={exportToCSV}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4 ml-2"
        >
          Export to CSV
        </button>

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Internship ID/userDetail</th>
              <th className="border p-2">Student</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Type</th>
              <th className="border p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.map((enrollment: any) => (
              <tr key={enrollment._id}>
                <td className="border p-2">
                  {enrollment.courseId} <br />{" "}
                  <span>
                    userName:{" "}
                    {enrollment.userId.firstName +
                      " " +
                      enrollment.userId.lastName}
                  </span>{" "}
                  <br />
                  <span>LoggedIn email: {enrollment.userId.email}</span>
                </td>
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
                <td className="border p-2">${enrollment.amount.toFixed(2)}</td>
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

      {/* query form submission  */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Query Form Submissions</h2>
        <input
          type="text"
          placeholder="Filter queries..."
          value={queryFilter}
          onChange={(e) => setQueryFilter(e.target.value)}
          className="border rounded px-2 py-1 mb-4 w-full"
        />
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
            {filteredQueries.map((query) => (
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

      {/* contact form submission  */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">
          Contact Form Submissions
        </h2>
        <input
          type="text"
          placeholder="Filter contacts..."
          value={contactFilter}
          onChange={(e) => setContactFilter(e.target.value)}
          className="border rounded px-2 py-1 mb-4 w-full"
        />
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
            {filteredContacts.map((contact) => (
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

      {/* one two one form submission */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">
          One To One Form Submissions
        </h2>
        <input
          type="text"
          placeholder="Filter contacts..."
          value={bookingFilter}
          onChange={(e) => setBookingFilter(e.target.value)}
          className="border rounded px-2 py-1 mb-4 w-full"
        />
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Full Name</th>
              <th className="border p-2">Domain</th>
              <th className="border p-2">Booking Date</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Message</th>
              <th className="border p-2">PhoneNumber</th>
              <th className="border p-2">Time</th>
              <th className="border p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking: any, idx: any) => (
              <tr key={idx}>
                <td className="border p-2">{booking.fullName}</td>
                <td className="border p-2">{booking.domain}</td>
                <td className="border p-2">{booking.date}</td>
                <td className="border p-2">{booking.email}</td>
                <td className="border p-2">{booking.message}</td>
                <td className="border p-2">{booking.phoneNumber}</td>
                <td className="border p-2">{booking.time}</td>
                <td className="border p-2">
                  {new Date(booking.createdAt).toLocaleDateString()}
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
