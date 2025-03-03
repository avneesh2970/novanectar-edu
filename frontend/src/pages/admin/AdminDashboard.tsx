/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import logo from "../../assets/nav-logo.png";
import { useAuth } from "../../hooks/useAuth";
import UserInfo from "./UserInfo";
import { FiDownload, FiChevronLeft, FiChevronRight } from "react-icons/fi";

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

  // New state for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [enrollmentsPerPage, setEnrollmentsPerPage] = useState(5);

  // New state for query pagination
  const [currentQueryPage, setCurrentQueryPage] = useState(1);
  const [queriesPerPage, setQueriesPerPage] = useState(5);

  // New state for contact pagination
  const [currentContactPage, setCurrentContactPage] = useState(1);
  const [contactsPerPage, setContactsPerPage] = useState(5);

  const [allUser, setAllUser] = useState<any>([]);
  const { getAllUsers } = useAuth();

  const userData = async () => {
    try {
      const res = await getAllUsers();
      setAllUser(res);
    } catch (error) {
      console.log("error in get user: ", error);
    }
  };

  useEffect(() => {
    userData();
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
      `${enrollment.userId?.firstName} ${enrollment.userId?.lastName}`,
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
        `${enrollment.userId?.firstName} ${enrollment.userId?.lastName}`,
        enrollment.userId?.email,
        enrollment.name,
        enrollment?.email,
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
      query?.email.toLowerCase().includes(queryFilter.toLowerCase()) ||
      query.phoneNumber.includes(queryFilter)
  );

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.fullName.toLowerCase().includes(contactFilter.toLowerCase()) ||
      contact?.email.toLowerCase().includes(contactFilter.toLowerCase()) ||
      contact.phoneNumber.includes(contactFilter) ||
      contact.course.toLowerCase().includes(contactFilter.toLowerCase()) ||
      contact.city.toLowerCase().includes(contactFilter.toLowerCase())
  );

  const filteredBookings = bookings.filter(
    (bookings: any) =>
      bookings.fullName.toLowerCase().includes(bookingFilter.toLowerCase()) ||
      bookings.domain.toLowerCase().includes(bookingFilter.toLowerCase()) ||
      bookings.date.includes(bookingFilter) ||
      bookings?.email.toLowerCase().includes(bookingFilter.toLowerCase()) ||
      bookings.message.toLowerCase().includes(bookingFilter.toLowerCase()) ||
      bookings.phoneNumber
        .toLowerCase()
        .includes(bookingFilter.toLowerCase()) ||
      bookings.time.toLowerCase().includes(bookingFilter.toLowerCase())
  );

  // Calculate pagination values
  const indexOfLastEnrollment = currentPage * enrollmentsPerPage;
  const indexOfFirstEnrollment = indexOfLastEnrollment - enrollmentsPerPage;
  const currentEnrollments = enrollments.slice(
    indexOfFirstEnrollment,
    indexOfLastEnrollment
  );
  const totalPages = Math.ceil(enrollments.length / enrollmentsPerPage);

  // Pagination navigation functions
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Generate page numbers for pagination controls
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPageButtons = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    let endPage = startPage + maxPageButtons - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPageButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  /////query pagination
  // Calculate pagination values for queries
  const indexOfLastQuery = currentQueryPage * queriesPerPage;
  const indexOfFirstQuery = indexOfLastQuery - queriesPerPage;
  const currentQueries = filteredQueries.slice(
    indexOfFirstQuery,
    indexOfLastQuery
  );
  const totalQueryPages = Math.ceil(filteredQueries.length / queriesPerPage);

  // Pagination navigation functions for queries
  const goToNextQueryPage = () => {
    if (currentQueryPage < totalQueryPages) {
      setCurrentQueryPage(currentQueryPage + 1);
    }
  };

  const goToPreviousQueryPage = () => {
    if (currentQueryPage > 1) {
      setCurrentQueryPage(currentQueryPage - 1);
    }
  };

  const goToQueryPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalQueryPages) {
      setCurrentQueryPage(pageNumber);
    }
  };

  // Generate page numbers for query pagination controls
  const getQueryPageNumbers = () => {
    const pageNumbers = [];
    const maxPageButtons = 5;

    let startPage = Math.max(
      1,
      currentQueryPage - Math.floor(maxPageButtons / 2)
    );
    let endPage = startPage + maxPageButtons - 1;

    if (endPage > totalQueryPages) {
      endPage = totalQueryPages;
      startPage = Math.max(1, endPage - maxPageButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  //contact pagination
  // Calculate pagination values for contacts
  const indexOfLastContact = currentContactPage * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;
  const currentContacts = filteredContacts.slice(
    indexOfFirstContact,
    indexOfLastContact
  );
  const totalContactPages = Math.ceil(
    filteredContacts.length / contactsPerPage
  );

  // Pagination navigation functions for contacts
  const goToNextContactPage = () => {
    if (currentContactPage < totalContactPages) {
      setCurrentContactPage(currentContactPage + 1);
    }
  };

  const goToPreviousContactPage = () => {
    if (currentContactPage > 1) {
      setCurrentContactPage(currentContactPage - 1);
    }
  };

  const goToContactPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalContactPages) {
      setCurrentContactPage(pageNumber);
    }
  };

  // Generate page numbers for contact pagination controls
  const getContactPageNumbers = () => {
    const pageNumbers = [];
    const maxPageButtons = 5;

    let startPage = Math.max(
      1,
      currentContactPage - Math.floor(maxPageButtons / 2)
    );
    let endPage = startPage + maxPageButtons - 1;

    if (endPage > totalContactPages) {
      endPage = totalContactPages;
      startPage = Math.max(1, endPage - maxPageButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="flex justify-center items-center gap-2">
        <img src={logo} alt="logo" className="w-44" />
      </nav>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="mb-8">
        {/* <h2 className="text-2xl font-semibold mb-4">Enrollment Statistics</h2> */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.map((stat) => (
            <div key={stat._id} className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">{stat._id}</h3>
              <p>Total Enrollments: {stat.count}</p>
              <p>Total Revenue: Rs{stat.totalAmount.toFixed(2)}</p>
            </div>
          ))}
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mt-4">All Registered Users</h2>
          <div className="p-4">
            <UserInfo allUser={allUser} />
          </div>
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
            {currentEnrollments.map((enrollment: any) => (
              <tr key={enrollment._id}>
                <td className="border p-2">
                  {enrollment.courseId} <br />{" "}
                  <span>
                    userName:{" "}
                    {enrollment.userId?.firstName +
                      " " +
                      enrollment.userId?.lastName}
                  </span>{" "}
                  <br />
                  <span>LoggedIn email: {enrollment.userId?.email}</span>
                </td>
                <td className="border p-2">
                  {enrollment.name}
                  <br />
                  <span className="text-sm text-gray-600">
                    {enrollment?.email}
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
        {/* Pagination Controls */}
        <div className="mt-4 flex items-center justify-between">
          <div>
            <span className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">{indexOfFirstEnrollment + 1}</span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(indexOfLastEnrollment, enrollments.length)}
              </span>{" "}
              of <span className="font-medium">{enrollments.length}</span>{" "}
              enrollments
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Previous page button */}
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className={`p-2 rounded ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-blue-600 hover:bg-blue-100"
              }`}
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>

            {/* Page numbers */}
            <div className="flex space-x-1">
              {getPageNumbers().map((number) => (
                <button
                  key={number}
                  onClick={() => goToPage(number)}
                  className={`px-3 py-1 rounded ${
                    currentPage === number
                      ? "bg-blue-500 text-white"
                      : "text-blue-600 hover:bg-blue-100"
                  }`}
                >
                  {number}
                </button>
              ))}
            </div>

            {/* Next page button */}
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`p-2 rounded ${
                currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-blue-600 hover:bg-blue-100"
              }`}
            >
              <FiChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Items per page selector */}
        <div className="mt-2 flex justify-end">
          <select
            value={enrollmentsPerPage}
            onChange={(e) => {
              setEnrollmentsPerPage(Number(e.target.value));
              setCurrentPage(1); // Reset to first page when changing items per page
            }}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
          </select>
        </div>
      </div>

      {/* query form submission  */}
      <div className="mt-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Query Form Submissions</h2>
          <div className="flex gap-4">
            <button
              onClick={() => {
                const doc: any = new jsPDF();

                // Add title
                doc.setFontSize(20);
                doc.setTextColor(40, 40, 40);
                doc.text("Query Form Submissions Report", 20, 20);

                // Add generation date
                doc.setFontSize(10);
                doc.setTextColor(100, 100, 100);
                doc.text(
                  `Generated on: ${new Date().toLocaleString()}`,
                  20,
                  30
                );

                // Add summary
                doc.setFontSize(12);
                doc.setTextColor(40, 40, 40);
                doc.text(`Total Queries: ${filteredQueries.length}`, 20, 40);

                // Prepare table data
                const tableColumn = [
                  "Full Name",
                  "Phone Number",
                  "Email",
                  "Date",
                ];
                const tableRows = filteredQueries.map((query) => [
                  query.fullName,
                  query.phoneNumber,
                  query?.email,
                  new Date(query.createdAt).toLocaleDateString(),
                ]);

                // Add table
                doc.autoTable({
                  startY: 50,
                  head: [tableColumn],
                  body: tableRows,
                  theme: "grid",
                  headStyles: {
                    fillColor: [51, 122, 183],
                    textColor: 255,
                    fontSize: 12,
                    halign: "center",
                  },
                  bodyStyles: {
                    fontSize: 10,
                  },
                  alternateRowStyles: {
                    fillColor: [245, 245, 245],
                  },
                  margin: { top: 50 },
                  styles: {
                    cellPadding: 3,
                    fontSize: 10,
                    valign: "middle",
                    overflow: "linebreak",
                    cellWidth: "auto",
                  },
                });

                // Add footer with page numbers
                const pageCount = doc.internal.getNumberOfPages();
                for (let i = 1; i <= pageCount; i++) {
                  doc.setPage(i);
                  doc.setFontSize(10);
                  doc.setTextColor(100, 100, 100);
                  doc.text(
                    `Page ${i} of ${pageCount}`,
                    doc.internal.pageSize.getWidth() - 30,
                    doc.internal.pageSize.getHeight() - 10
                  );
                }

                doc.save("query-submissions.pdf");
              }}
              className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              <FiDownload /> Export as PDF
            </button>
            <button
              onClick={() => {
                const headers = ["Full Name", "Phone Number", "Email", "Date"];
                const csvData = filteredQueries.map((query) => [
                  query.fullName,
                  query.phoneNumber,
                  query?.email,
                  new Date(query.createdAt).toLocaleDateString(),
                ]);

                const csvContent = [
                  headers.join(","),
                  ...csvData.map((row) => row.join(",")),
                ].join("\n");

                const blob = new Blob([csvContent], { type: "text/csv" });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "query-submissions.csv";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
              }}
              className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
            >
              <FiDownload /> Export as CSV
            </button>
          </div>
        </div>

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
            {currentQueries.map((query) => (
              <tr key={query._id}>
                <td className="border p-2">{query.fullName}</td>
                <td className="border p-2">{query.phoneNumber}</td>
                <td className="border p-2">{query?.email}</td>
                <td className="border p-2">
                  {new Date(query.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Pagination Controls for Queries */}
        <div className="mt-4 flex items-center justify-between">
          <div>
            <span className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">{indexOfFirstQuery + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(indexOfLastQuery, filteredQueries.length)}
              </span>{" "}
              of <span className="font-medium">{filteredQueries.length}</span>{" "}
              queries
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Previous page button */}
            <button
              onClick={goToPreviousQueryPage}
              disabled={currentQueryPage === 1}
              className={`p-2 rounded ${
                currentQueryPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-blue-600 hover:bg-blue-100"
              }`}
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>

            {/* Page numbers */}
            <div className="flex space-x-1">
              {getQueryPageNumbers().map((number) => (
                <button
                  key={number}
                  onClick={() => goToQueryPage(number)}
                  className={`px-3 py-1 rounded ${
                    currentQueryPage === number
                      ? "bg-blue-500 text-white"
                      : "text-blue-600 hover:bg-blue-100"
                  }`}
                >
                  {number}
                </button>
              ))}
            </div>

            {/* Next page button */}
            <button
              onClick={goToNextQueryPage}
              disabled={currentQueryPage === totalQueryPages}
              className={`p-2 rounded ${
                currentQueryPage === totalQueryPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-blue-600 hover:bg-blue-100"
              }`}
            >
              <FiChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Items per page selector for Queries */}
        <div className="mt-2 flex justify-end">
          <select
            value={queriesPerPage}
            onChange={(e) => {
              setQueriesPerPage(Number(e.target.value));
              setCurrentQueryPage(1);
            }}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
          </select>
        </div>
      </div>

      {/* contact form submission  */}
      <div className="mt-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Contact Form Submissions</h2>
          <div className="flex gap-4">
            <button
              onClick={() => {
                const doc: any = new jsPDF();

                // Add title
                doc.setFontSize(20);
                doc.setTextColor(40, 40, 40);
                doc.text("Contact Form Submissions Report", 20, 20);

                // Add generation date
                doc.setFontSize(10);
                doc.setTextColor(100, 100, 100);
                doc.text(
                  `Generated on: ${new Date().toLocaleString()}`,
                  20,
                  30
                );

                // Add summary
                doc.setFontSize(12);
                doc.setTextColor(40, 40, 40);
                doc.text(`Total Contacts: ${filteredContacts.length}`, 20, 40);

                // Prepare table data
                const tableColumn = [
                  "Full Name",
                  "Course",
                  "City",
                  "Phone Number",
                  "Email",
                  "Date",
                ];
                const tableRows = filteredContacts.map((contact) => [
                  contact.fullName,
                  contact.course,
                  contact.city,
                  contact.phoneNumber,
                  contact?.email,
                  new Date(contact.createdAt).toLocaleDateString(),
                ]);

                // Add table
                doc.autoTable({
                  startY: 50,
                  head: [tableColumn],
                  body: tableRows,
                  theme: "grid",
                  headStyles: {
                    fillColor: [51, 122, 183],
                    textColor: 255,
                    fontSize: 12,
                    halign: "center",
                  },
                  bodyStyles: {
                    fontSize: 10,
                  },
                  alternateRowStyles: {
                    fillColor: [245, 245, 245],
                  },
                  margin: { top: 50 },
                  styles: {
                    cellPadding: 3,
                    fontSize: 10,
                    valign: "middle",
                    overflow: "linebreak",
                    cellWidth: "auto",
                  },
                });

                // Add footer with page numbers
                const pageCount = doc.internal.getNumberOfPages();
                for (let i = 1; i <= pageCount; i++) {
                  doc.setPage(i);
                  doc.setFontSize(10);
                  doc.setTextColor(100, 100, 100);
                  doc.text(
                    `Page ${i} of ${pageCount}`,
                    doc.internal.pageSize.getWidth() - 30,
                    doc.internal.pageSize.getHeight() - 10
                  );
                }

                doc.save("contact-submissions.pdf");
              }}
              className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              <FiDownload /> Export as PDF
            </button>
            <button
              onClick={() => {
                const headers = [
                  "Full Name",
                  "Course",
                  "City",
                  "Phone Number",
                  "Email",
                  "Date",
                ];
                const csvData = filteredContacts.map((contact) => [
                  contact.fullName,
                  contact.course,
                  contact.city,
                  contact.phoneNumber,
                  contact?.email,
                  new Date(contact.createdAt).toLocaleDateString(),
                ]);

                const csvContent = [
                  headers.join(","),
                  ...csvData.map((row) => row.join(",")),
                ].join("\n");

                const blob = new Blob([csvContent], { type: "text/csv" });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "contact-submissions.csv";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
              }}
              className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
            >
              <FiDownload /> Export as CSV
            </button>
          </div>
        </div>

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
            {currentContacts.map((contact) => (
              <tr key={contact._id}>
                <td className="border p-2">{contact.fullName}</td>
                <td className="border p-2">{contact.course}</td>
                <td className="border p-2">{contact.city}</td>
                <td className="border p-2">{contact.phoneNumber}</td>
                <td className="border p-2">{contact?.email}</td>
                <td className="border p-2">
                  {new Date(contact.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <span className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">{indexOfFirstContact + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(indexOfLastContact, filteredContacts.length)}
              </span>{" "}
              of <span className="font-medium">{filteredContacts.length}</span>{" "}
              contacts
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Previous page button */}
            <button
              onClick={goToPreviousContactPage}
              disabled={currentContactPage === 1}
              className={`p-2 rounded ${
                currentContactPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-blue-600 hover:bg-blue-100"
              }`}
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>

            {/* Page numbers */}
            <div className="flex space-x-1">
              {getContactPageNumbers().map((number) => (
                <button
                  key={number}
                  onClick={() => goToContactPage(number)}
                  className={`px-3 py-1 rounded ${
                    currentContactPage === number
                      ? "bg-blue-500 text-white"
                      : "text-blue-600 hover:bg-blue-100"
                  }`}
                >
                  {number}
                </button>
              ))}
            </div>

            {/* Next page button */}
            <button
              onClick={goToNextContactPage}
              disabled={currentContactPage === totalContactPages}
              className={`p-2 rounded ${
                currentContactPage === totalContactPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-blue-600 hover:bg-blue-100"
              }`}
            >
              <FiChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Items per page selector for Contacts */}
        <div className="mt-2 flex justify-end">
          <select
            value={contactsPerPage}
            onChange={(e) => {
              setContactsPerPage(Number(e.target.value));
              setCurrentContactPage(1);
            }}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
          </select>
        </div>
      </div>

      {/* one two one form submission */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">
          One To One Form Submissions
        </h2>
        <div className="flex gap-4">
          <button
            onClick={() => {
              const doc: any = new jsPDF();

              // Add title
              doc.setFontSize(20);
              doc.setTextColor(40, 40, 40);
              doc.text("One To One Form Submissions Report", 20, 20);

              // Add generation date
              doc.setFontSize(10);
              doc.setTextColor(100, 100, 100);
              doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 30);

              // Add summary
              doc.setFontSize(12);
              doc.setTextColor(40, 40, 40);
              doc.text(`Total submissons: ${filteredContacts.length}`, 20, 40);

              // Prepare table data
              const tableColumn = [
                "Full Name",
                "Domain",
                "Booking Date",
                "Email",
                "Message",
                "Phone Number",
                "Time",
                "Date",
              ];
              const tableRows = filteredBookings.map((booking: any) => [
                booking.fullName,
                booking.domain,
                booking.bookingDate,
                booking?.email,
                booking.message,
                booking.phoneNumber,
                booking.time,
                booking.date,
                new Date(booking.createdAt).toLocaleDateString(),
              ]);

              // Add table
              doc.autoTable({
                startY: 50,
                head: [tableColumn],
                body: tableRows,
                theme: "grid",
                headStyles: {
                  fillColor: [51, 122, 183],
                  textColor: 255,
                  fontSize: 12,
                  halign: "center",
                },
                bodyStyles: {
                  fontSize: 10,
                },
                alternateRowStyles: {
                  fillColor: [245, 245, 245],
                },
                margin: { top: 50 },
                styles: {
                  cellPadding: 3,
                  fontSize: 10,
                  valign: "middle",
                  overflow: "linebreak",
                  cellWidth: "auto",
                },
              });

              // Add footer with page numbers
              const pageCount = doc.internal.getNumberOfPages();
              for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(10);
                doc.setTextColor(100, 100, 100);
                doc.text(
                  `Page ${i} of ${pageCount}`,
                  doc.internal.pageSize.getWidth() - 30,
                  doc.internal.pageSize.getHeight() - 10
                );
              }

              doc.save("bookings-submissions.pdf");
            }}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            <FiDownload /> Export as PDF
          </button>
          <button
            onClick={() => {
              const headers = [
                "Full Name",
                "Domain",
                "Booking Date",
                "Email",
                "Message",
                "Phone Number",
                "Time",
                "Date",
              ];
              const csvData = filteredBookings.map((booking: any) => [
                booking.fullName,
                booking.domain,
                booking.bookingDate,
                booking?.email,
                booking.message,
                booking.phoneNumber,
                booking.time,
                booking.date,
                new Date(booking.createdAt).toLocaleDateString(),
              ]);

              const csvContent = [
                headers.join(","),
                ...csvData.map((row: any) => row.join(",")),
              ].join("\n");

              const blob = new Blob([csvContent], { type: "text/csv" });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "booking-submissions.csv";
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              window.URL.revokeObjectURL(url);
            }}
            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
          >
            <FiDownload /> Export as CSV
          </button>
        </div>
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
                <td className="border p-2">{booking?.email}</td>
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
