/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react"; // Ensure React is imported for React.memo and React.FC
import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import toast, { Toaster } from "react-hot-toast";
import {
  FiDownload,
  FiChevronLeft,
  FiChevronRight,
  FiMenu,
  FiX,
  FiUser,
  FiMail,
  FiCalendar,
  FiBook,
  FiBriefcase,
  FiBarChart2,
  FiUsers,
  FiClipboard,
  FiHelpCircle,
  FiPhone,
  FiFilter,
  FiSearch,
  FiRefreshCw,
  FiTrendingUp,
  FiEye,
} from "react-icons/fi";
import { FaFileSignature } from "react-icons/fa";
import OfferLetter from "./OfferLetter";

// Types
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
  userId: any;
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

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  enrollments: any[];
}

interface BookingSubmission {
  _id?: string;
  fullName: string;
  domain: string;
  date: string;
  email?: string;
  message: string;
  phoneNumber: string;
  time: string;
  createdAt: string;
}

// Memoized SearchInput component to prevent focus loss
const SearchInput = React.memo(
  ({
    value,
    onChange,
    placeholder,
  }: {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
  }) => {
    return (
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
        />
      </div>
    );
  }
);
SearchInput.displayName = "SearchInput";

// Memoized EnrollmentFilters component
const EnrollmentFilters = React.memo(
  ({
    filters,
    onFilterChange,
    onApplyFilters,
  }: {
    filters: {
      startDate: string;
      endDate: string;
      orderType: string;
      feeStatus: string;
    };
    onFilterChange: (key: string, value: string) => void;
    onApplyFilters: () => void;
  }) => {
    return (
      <>
        <input
          type="date"
          value={filters.startDate}
          onChange={(e) => onFilterChange("startDate", e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
        <input
          type="date"
          value={filters.endDate}
          onChange={(e) => onFilterChange("endDate", e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
        <select
          value={filters.orderType}
          onChange={(e) => onFilterChange("orderType", e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        >
          <option value="all">All Types</option>
          <option value="course">Course</option>
          <option value="internship">Internship</option>
        </select>
        <select
          value={filters.feeStatus}
          onChange={(e) => onFilterChange("feeStatus", e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        >
          <option value="all">Status</option>
          <option value="paid">Paid</option>
          <option value="created">Created</option>
        </select>
        <button
          onClick={onApplyFilters}
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <FiFilter className="h-4 w-4 mr-2" />
          Filter
        </button>
      </>
    );
  }
);
EnrollmentFilters.displayName = "EnrollmentFilters";

// Table header with filters and export - Memoized
const TableHeader = React.memo(
  ({
    title,
    data,
    filename,
    columns,
    searchValue,
    onSearchChange,
    additionalFilters,
  }: {
    title: string;
    data: any[];
    filename: string;
    columns: string[];
    searchValue: string;
    onSearchChange?: (value: string) => void;
    additionalFilters?: React.ReactNode;
  }) => {
    const formatDate = useCallback((dateString: string) => {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }, []);

    const formatCurrency = useCallback((amount: number) => {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(amount);
    }, []);

    const exportToPDF = useCallback(
      (data: any[], filename: string, columns: string[], title: string) => {
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.setTextColor(40, 40, 40);
        doc.text(title, 20, 20);
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 30);
        doc.setFontSize(12);
        doc.setTextColor(40, 40, 40);
        doc.text(`Total Records: ${data.length}`, 20, 40);

        let tableRows: any[] = [];
        if (filename.includes("user")) {
          tableRows = data.map((user: User) => [
            `${user.firstName} ${user.lastName}`,
            user.email,
            formatDate(user.createdAt),
            user.enrollments.length,
          ]);
        } else if (filename.includes("enrollment")) {
          tableRows = data.map((enrollment: Enrollment) => [
            enrollment.courseId,
            `${enrollment.userId?.firstName || ""} ${
              enrollment.userId?.lastName || ""
            }`,
            enrollment.name,
            formatCurrency(enrollment.amount),
            formatDate(enrollment.createdAt),
            enrollment.orderType,
            enrollment.status,
          ]);
        } else if (filename.includes("query")) {
          tableRows = data.map((query: QuerySubmission) => [
            query.fullName,
            query.phoneNumber,
            query.email || "",
            formatDate(query.createdAt),
          ]);
        } else if (filename.includes("contact")) {
          tableRows = data.map((contact: ContactSubmission) => [
            contact.fullName,
            contact.course,
            contact.city,
            contact.phoneNumber,
            contact.email || "",
            formatDate(contact.createdAt),
          ]);
        }
        (doc as any).autoTable({
          startY: 50,
          head: [columns],
          body: tableRows,
          theme: "grid",
          headStyles: {
            fillColor: [59, 130, 246],
            textColor: 255,
            fontSize: 12,
            halign: "center",
          },
          bodyStyles: { fontSize: 10 },
          alternateRowStyles: { fillColor: [245, 245, 245] },
          margin: { top: 50 },
          styles: {
            cellPadding: 3,
            fontSize: 10,
            valign: "middle",
            overflow: "linebreak",
            cellWidth: "auto",
          },
        });

        const pageCount = (doc as any).internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.setFontSize(10);
          doc.setTextColor(100, 100, 100);
          doc.text(
            `Page ${i} of ${pageCount}`,
            (doc as any).internal.pageSize.getWidth() - 30,
            (doc as any).internal.pageSize.getHeight() - 10
          );
        }
        doc.save(`${filename}.pdf`);
        toast.success(`${title} exported as PDF successfully!`);
      },
      [formatDate, formatCurrency]
    );

    const exportToCSV = useCallback(
      (data: any[], filename: string, columns: string[]) => {
        let csvData: any[] = [];
        if (filename.includes("user")) {
          csvData = data.map((user: User) => [
            `${user.firstName} ${user.lastName}`,
            user.email,
            formatDate(user.createdAt),
            user.enrollments.length,
          ]);
        } else if (filename.includes("enrollment")) {
          csvData = data.map((enrollment: Enrollment) => [
            enrollment.courseId,
            `${enrollment.userId?.firstName || ""} ${
              enrollment.userId?.lastName || ""
            }`,
            enrollment.userId?.email || "",
            enrollment.name,
            enrollment.email || "",
            enrollment.phone,
            enrollment.amount.toFixed(2),
            formatDate(enrollment.createdAt),
            enrollment.orderType,
            enrollment.status,
          ]);
        } else if (filename.includes("query")) {
          csvData = data.map((query: QuerySubmission) => [
            query.fullName,
            query.phoneNumber,
            query.email || "",
            formatDate(query.createdAt),
          ]);
        } else if (filename.includes("contact")) {
          csvData = data.map((contact: ContactSubmission) => [
            contact.fullName,
            contact.course,
            contact.city,
            contact.phoneNumber,
            contact.email || "",
            formatDate(contact.createdAt),
          ]);
        }

        const csvContent = [
          columns.join(","),
          ...csvData.map((row) =>
            row.map((cell: any) => `"${cell}"`).join(",")
          ),
        ].join("\n");
        const blob = new Blob(["\ufeff" + csvContent], {
          type: "text/csv;charset=utf-8;",
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${filename}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        toast.success("Data exported as CSV successfully!");
      },
      [formatDate]
    );

    return (
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            {title}
          </h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => exportToPDF(data, filename, columns, title)}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <FiDownload className="h-4 w-4 mr-2" />
              PDF
            </button>
            <button
              onClick={() => exportToCSV(data, filename, columns)}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <FiDownload className="h-4 w-4 mr-2" />
              CSV
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4 mb-4">
          {/* Use memoized SearchInput only if onSearchChange is provided (not for enrollments) */}
          {onSearchChange && (
            <SearchInput
              value={searchValue}
              onChange={onSearchChange}
              placeholder={`Search ${title.toLowerCase()}...`}
            />
          )}
          {additionalFilters && (
            <div className="flex flex-wrap gap-2">{additionalFilters}</div>
          )}
        </div>
      </div>
    );
  }
);
TableHeader.displayName = "TableHeader";

const AdminDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [stats, setStats] = useState<EnrollmentStats[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [queries, setQueries] = useState<QuerySubmission[]>([]);
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [bookings, setBookings] = useState<BookingSubmission[]>([]);
  const [allUser, setAllUser] = useState<User[]>([]);

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    orderType: "all",
    feeStatus: "all",
    queryFilter: "",
    contactFilter: "",
    bookingFilter: "",
    userFilter: "",
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 10,
  });

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handlePaginationChange = useCallback((key: string, value: number) => {
    setPagination((prev) => ({ ...prev, [key]: value }));
  }, []);

  const API_BASE_URL = import.meta.env.VITE_API_URL || "";

  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/auth/get-all-users`,
        { withCredentials: true }
      );
      setAllUser(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    }
  }, [API_BASE_URL]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/admin/enrollment-stats`,
        { withCredentials: true }
      );
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }, [API_BASE_URL]);

  const fetchEnrollments = useCallback(async () => {
    // This function is now also the onApplyFilters for EnrollmentFilters
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/admin/filtered-enrollments`,
        {
          params: {
            startDate: filters.startDate,
            endDate: filters.endDate,
            orderType: filters.orderType === "all" ? "" : filters.orderType,
            status: filters.feeStatus === "all" ? "" : filters.feeStatus,
          },
          withCredentials: true,
        }
      );
      setEnrollments(response.data);
      toast.success("Enrollments filtered successfully!");
    } catch (error) {
      console.error("Error fetching enrollments:", error);
      toast.error("Failed to filter enrollments.");
    }
  }, [
    API_BASE_URL,
    filters.startDate,
    filters.endDate,
    filters.orderType,
    filters.feeStatus,
  ]);

  const fetchQueries = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/all-queries`, {
        withCredentials: true,
      });
      setQueries(response.data);
    } catch (error) {
      console.error("Error fetching queries:", error);
    }
  }, [API_BASE_URL]);

  const fetchContacts = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/all-contacts`, {
        withCredentials: true,
      });
      setContacts(response.data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  }, [API_BASE_URL]);

  const fetchBookings = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/get-bookings`, {
        withCredentials: true,
      });
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  }, [API_BASE_URL]);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchStats(),
        fetchEnrollments(), // Initial fetch for enrollments
        fetchQueries(),
        fetchContacts(),
        fetchBookings(),
        fetchUsers(),
      ]);
      toast.success("Data refreshed successfully!");
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to refresh data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [
    fetchStats,
    fetchEnrollments,
    fetchQueries,
    fetchContacts,
    fetchBookings,
    fetchUsers,
  ]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const sidebarItems = useMemo(
    () => [
      { id: "dashboard", label: "Dashboard", icon: FiBarChart2 },
      { id: "users", label: "Users", icon: FiUsers },
      { id: "enrollments", label: "Enrollments", icon: FiClipboard },
      { id: "queries", label: "Queries", icon: FiHelpCircle },
      { id: "contacts", label: "Contacts", icon: FiPhone },
      { id: "bookings", label: "Bookings", icon: FiCalendar },
      { id: "offer", label: "Offer Letter", icon: FaFileSignature },
    ],
    []
  );

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, []);

  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  }, []);

  const getFilteredData = useMemo(() => {
    // This function itself is memoized, its stability depends on its dependencies.
    // The dependencies are individual filter strings, which is good.
    return (section: string) => {
      switch (section) {
        case "users": {
          const filteredUsers = allUser.filter(
            (user) =>
              filters.userFilter === "" ||
              user.firstName
                .toLowerCase()
                .includes(filters.userFilter.toLowerCase()) ||
              user.lastName
                .toLowerCase()
                .includes(filters.userFilter.toLowerCase()) ||
              user.email
                .toLowerCase()
                .includes(filters.userFilter.toLowerCase())
          );
          return filteredUsers;
        }
        case "queries": {
          const filteredQueries = queries.filter(
            (query) =>
              filters.queryFilter === "" ||
              query.fullName
                .toLowerCase()
                .includes(filters.queryFilter.toLowerCase()) ||
              (query.email &&
                query.email
                  .toLowerCase()
                  .includes(filters.queryFilter.toLowerCase())) ||
              query.phoneNumber.includes(filters.queryFilter)
          );
          return filteredQueries;
        }
        case "contacts": {
          const filteredContacts = contacts.filter(
            (contact) =>
              filters.contactFilter === "" ||
              contact.fullName
                .toLowerCase()
                .includes(filters.contactFilter.toLowerCase()) ||
              (contact.email &&
                contact.email
                  .toLowerCase()
                  .includes(filters.contactFilter.toLowerCase())) ||
              contact.phoneNumber.includes(filters.contactFilter) ||
              contact.course
                .toLowerCase()
                .includes(filters.contactFilter.toLowerCase()) ||
              contact.city
                .toLowerCase()
                .includes(filters.contactFilter.toLowerCase())
          );
          return filteredContacts;
        }
        case "bookings": {
          const filteredBookings = bookings.filter(
            (booking: BookingSubmission) =>
              filters.bookingFilter === "" ||
              booking.fullName
                .toLowerCase()
                .includes(filters.bookingFilter.toLowerCase()) ||
              booking.domain
                .toLowerCase()
                .includes(filters.bookingFilter.toLowerCase()) ||
              booking.date.includes(filters.bookingFilter) ||
              (booking.email &&
                booking.email
                  .toLowerCase()
                  .includes(filters.bookingFilter.toLowerCase())) ||
              booking.message
                .toLowerCase()
                .includes(filters.bookingFilter.toLowerCase()) ||
              booking.phoneNumber
                .toLowerCase()
                .includes(filters.bookingFilter.toLowerCase()) ||
              booking.time
                .toLowerCase()
                .includes(filters.bookingFilter.toLowerCase())
          );
          return filteredBookings;
        }
        default:
          return [];
      }
    };
  }, [
    allUser,
    queries,
    contacts,
    bookings,
    filters.userFilter,
    filters.queryFilter,
    filters.contactFilter,
    filters.bookingFilter,
  ]);

  const getPaginatedData = useCallback(
    (data: any[]) => {
      const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
      const endIndex = startIndex + pagination.itemsPerPage;
      return data.slice(startIndex, endIndex);
    },
    [pagination.currentPage, pagination.itemsPerPage]
  );

  const getTotalPages = useCallback(
    (dataLength: number) => {
      return Math.ceil(dataLength / pagination.itemsPerPage);
    },
    [pagination.itemsPerPage]
  );

  useEffect(() => {
    handlePaginationChange("currentPage", 1);
  }, [activeSection, handlePaginationChange]);

  const Sidebar = useMemo(
    () => () =>
      (
        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
              Admin Panel
            </h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>
          <nav className="mt-6 px-3">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-3 py-2 mb-1 text-left rounded-lg transition-colors duration-200 ${
                  activeSection === item.id
                    ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      ),
    [sidebarOpen, activeSection, sidebarItems]
  ); // Added dependencies

  const Header = useMemo(
    () => () =>
      (
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center min-w-0">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden mr-2 p-2 rounded-md hover:bg-gray-100 transition-colors flex-shrink-0"
              >
                <FiMenu className="h-5 w-5" />
              </button>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 capitalize truncate">
                {activeSection === "dashboard"
                  ? "Dashboard Overview"
                  : activeSection}
              </h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
              <button
                onClick={fetchAllData}
                disabled={loading}
                className="flex items-center px-3 sm:px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FiRefreshCw
                  className={`h-4 w-4 mr-0 sm:mr-2 ${
                    loading ? "animate-spin" : ""
                  }`}
                />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>
        </header>
      ),
    [activeSection, loading, fetchAllData]
  ); // Added dependencies

  const StatsCards = useMemo(
    () => () =>
      (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {stats.map((stat) => (
            <div
              key={stat._id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600 truncate">
                  {stat._id}
                </h3>
                <FiTrendingUp className="h-5 w-5 text-green-600 flex-shrink-0" />
              </div>
              <div className="space-y-2">
                <div className="text-xl sm:text-2xl font-bold text-gray-900">
                  {stat.count}
                </div>
                <p className="text-xs sm:text-sm text-gray-600">
                  Total Enrollments
                </p>
                <div className="text-base sm:text-lg font-semibold text-green-600">
                  {formatCurrency(stat.totalAmount)}
                </div>
                <p className="text-xs text-gray-500">Total Revenue</p>
              </div>
            </div>
          ))}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Total Users</h3>
              <FiUsers className="h-5 w-5 text-blue-600" />
            </div>
            <div className="space-y-2">
              <div className="text-xl sm:text-2xl font-bold text-gray-900">
                {allUser.length}
              </div>
              <p className="text-xs sm:text-sm text-gray-600">
                Registered Users
              </p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">
                Total Queries
              </h3>
              <FiHelpCircle className="h-5 w-5 text-orange-600" />
            </div>
            <div className="space-y-2">
              <div className="text-xl sm:text-2xl font-bold text-gray-900">
                {queries.length}
              </div>
              <p className="text-xs sm:text-sm text-gray-600">
                Query Submissions
              </p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">
                Total Contacts
              </h3>
              <FiPhone className="h-5 w-5 text-purple-600" />
            </div>
            <div className="space-y-2">
              <div className="text-xl sm:text-2xl font-bold text-gray-900">
                {contacts.length}
              </div>
              <p className="text-xs sm:text-sm text-gray-600">
                Contact Submissions
              </p>
            </div>
          </div>
        </div>
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [stats, allUser.length, queries.length, contacts.length]
  ); // Added dependencies

  const PaginationComponent = React.memo(
    ({ totalItems }: { totalItems: number }) => {
      const totalPages = getTotalPages(totalItems);
      if (totalPages === 0) return null;
      const startIndex =
        (pagination.currentPage - 1) * pagination.itemsPerPage + 1;
      const endIndex = Math.min(
        pagination.currentPage * pagination.itemsPerPage,
        totalItems
      );

      return (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <span className="text-sm text-gray-700 text-center sm:text-left">
              Showing {startIndex} to {endIndex} of {totalItems} entries
            </span>
            <select
              value={pagination.itemsPerPage.toString()}
              onChange={(e) => {
                handlePaginationChange("itemsPerPage", Number(e.target.value));
                handlePaginationChange("currentPage", 1); // Reset to page 1
              }}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="5">5 per page</option>
              <option value="10">10 per page</option>
              <option value="25">25 per page</option>
              <option value="50">50 per page</option>
            </select>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() =>
                handlePaginationChange(
                  "currentPage",
                  Math.max(1, pagination.currentPage - 1)
                )
              }
              disabled={pagination.currentPage === 1}
              className="p-2 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FiChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum = i + 1;
                if (totalPages > 5 && pagination.currentPage > 3) {
                  pageNum = pagination.currentPage - 2 + i;
                }
                if (pageNum > totalPages) return null;
                if (pageNum <= 0) return null; // Ensure pageNum is positive

                return (
                  <button
                    key={pageNum}
                    onClick={() =>
                      handlePaginationChange("currentPage", pageNum)
                    }
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-md text-sm font-medium transition-colors ${
                      pagination.currentPage === pageNum
                        ? "bg-blue-600 text-white"
                        : "border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() =>
                handlePaginationChange(
                  "currentPage",
                  Math.min(totalPages, pagination.currentPage + 1)
                )
              }
              disabled={pagination.currentPage === totalPages}
              className="p-2 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FiChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      );
    }
  );
  PaginationComponent.displayName = "PaginationComponent";

  const UserModal = React.memo(
    ({
      user,
      isOpen,
      onClose,
    }: {
      user: User | null;
      isOpen: boolean;
      onClose: () => void;
    }) => {
      if (!isOpen || !user) return null;
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl sm:text-2xl font-semibold flex items-center gap-2">
                  <FiUser className="h-5 w-5" /> User Details
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <FiUser className="text-blue-500 h-4 w-4 flex-shrink-0" />
                    <span className="font-medium">Name:</span>
                    <span className="truncate">
                      {user.firstName} {user.lastName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiMail className="text-blue-500 h-4 w-4 flex-shrink-0" />
                    <span className="font-medium">Email:</span>
                    <span className="truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiCalendar className="text-blue-500 h-4 w-4 flex-shrink-0" />
                    <span className="font-medium">Joined:</span>
                    <span>{formatDate(user.createdAt)}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <FiBook className="text-blue-500 h-4 w-4" /> Enrollments (
                    {user.enrollments.length})
                  </h3>
                  {user.enrollments.length > 0 ? (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="space-y-3">
                        {user.enrollments.map((enrollment: any) => (
                          <div
                            key={enrollment._id}
                            className="flex items-center gap-3 p-2 bg-white rounded border"
                          >
                            {enrollment.type === "course" ? (
                              <FiBook className="text-blue-500 h-4 w-4 flex-shrink-0" />
                            ) : (
                              <FiBriefcase className="text-green-500 h-4 w-4 flex-shrink-0" />
                            )}
                            <div className="min-w-0">
                              <span className="capitalize font-medium">
                                {enrollment.type}
                              </span>
                              <p className="text-sm text-gray-500 truncate">
                                ID: {enrollment.item}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 bg-gray-50 rounded-lg p-4">
                      No enrollments yet
                    </p>
                  )}
                </div>
                <div className="text-sm text-gray-500 pt-4 border-t">
                  Last updated: {formatDate(user.updatedAt)}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  );
  UserModal.displayName = "UserModal";

  const Badge = React.memo(
    ({
      children,
      variant = "default",
    }: {
      children: React.ReactNode;
      variant?: "default" | "secondary" | "destructive" | "outline";
    }) => {
      const baseClasses =
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
      const variantClasses = {
        default: "bg-blue-100 text-blue-800",
        secondary: "bg-gray-100 text-gray-800",
        destructive: "bg-red-100 text-red-800",
        outline: "border border-gray-300 text-gray-700",
      };
      return (
        <span className={`${baseClasses} ${variantClasses[variant]}`}>
          {children}
        </span>
      );
    }
  );
  Badge.displayName = "Badge";

  // Memoized enrollment filters specifically for the enrollments section
  const memoizedEnrollmentFilters = useMemo(() => {
    return (
      <EnrollmentFilters
        filters={{
          startDate: filters.startDate,
          endDate: filters.endDate,
          orderType: filters.orderType,
          feeStatus: filters.feeStatus,
        }}
        onFilterChange={handleFilterChange}
        onApplyFilters={fetchEnrollments} // fetchEnrollments is already useCallback'd
      />
    );
  }, [
    filters.startDate,
    filters.endDate,
    filters.orderType,
    filters.feeStatus,
    handleFilterChange,
    fetchEnrollments,
  ]);

  const renderContent = useCallback(() => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <StatsCards />
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <p className="text-gray-600">
                Welcome to your admin dashboard. Use the sidebar to navigate
                between different sections.
              </p>
            </div>
          </div>
        );

      case "users": {
        const filteredUsers = getFilteredData("users") as User[];
        const paginatedUsers = getPaginatedData(filteredUsers);
        return (
          <div>
            <TableHeader
              title="Registered Users"
              data={filteredUsers}
              filename="users"
              columns={["Name", "Email", "Join Date", "Enrollments"]}
              searchValue={filters.userFilter}
              onSearchChange={(value) =>
                handleFilterChange("userFilter", value)
              }
            />
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Join Date
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Enrollments
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedUsers.map((user) => (
                      <tr
                        key={user._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                              <span className="text-sm font-medium text-blue-600">
                                {user.firstName.charAt(0)}
                              </span>
                            </div>
                            <div className="min-w-0">
                              <div className="font-medium text-gray-900 truncate">
                                {user.firstName} {user.lastName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-600">
                          <div className="truncate max-w-xs">{user.email}</div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-600">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <Badge variant="secondary">
                            {user.enrollments.length}
                          </Badge>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setIsModalOpen(true);
                            }}
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <FiEye className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <PaginationComponent totalItems={filteredUsers.length} />
            <UserModal
              user={selectedUser}
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
            />
          </div>
        );
      }

      case "enrollments": {
        const paginatedEnrollments = getPaginatedData(enrollments);
        return (
          <div>
            <TableHeader
              title="Enrollments"
              data={enrollments}
              filename="enrollments"
              columns={[
                "ID",
                "User Name",
                "Student Name",
                "Amount",
                "Date",
                "Type",
                "Status",
              ]}
              searchValue="" // No search for enrollments in this setup
              // onSearchChange is not passed, so SearchInput won't render for enrollments
              additionalFilters={memoizedEnrollmentFilters}
              // onSearchChange={()=>""}
            />
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Course/Internship ID
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student Details
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedEnrollments.map((enrollment: any) => (
                      <tr
                        key={enrollment._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="font-medium text-gray-900 truncate">
                              {enrollment.courseId}
                            </div>
                            <div className="text-sm text-gray-500 truncate">
                              User: {enrollment.userId?.firstName}{" "}
                              {enrollment.userId?.lastName}
                            </div>
                            <div className="text-sm text-gray-500 truncate">
                              Email: {enrollment.userId?.email}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="font-medium text-gray-900 truncate">
                              {enrollment.name}
                            </div>
                            <div className="text-sm text-gray-500 truncate">
                              {enrollment.email}
                            </div>
                            <div className="text-sm text-gray-500">
                              {enrollment.phone}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                          {formatCurrency(enrollment.amount)}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-600">
                          {formatDate(enrollment.createdAt)}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <Badge
                            variant={
                              enrollment.orderType === "course"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {enrollment.orderType}
                          </Badge>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <Badge
                            variant={
                              enrollment.status === "paid"
                                ? "default"
                                : enrollment.status === "pending"
                                ? "secondary"
                                : "destructive"
                            }
                          >
                            {enrollment.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <PaginationComponent totalItems={enrollments.length} />
          </div>
        );
      }

      case "queries": {
        const filteredQueries = getFilteredData("queries") as QuerySubmission[];
        const paginatedQueries = getPaginatedData(filteredQueries);
        return (
          <div>
            <TableHeader
              title="Query Submissions"
              data={filteredQueries}
              filename="queries"
              columns={["Full Name", "Phone Number", "Email", "Date"]}
              searchValue={filters.queryFilter}
              onSearchChange={(value) =>
                handleFilterChange("queryFilter", value)
              }
            />
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Full Name
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone Number
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedQueries.map((query) => (
                      <tr
                        key={query._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                          <div className="truncate max-w-xs">
                            {query.fullName}
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-600">
                          {query.phoneNumber}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-600">
                          <div className="truncate max-w-xs">
                            {query.email || "N/A"}
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-600">
                          {formatDate(query.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <PaginationComponent totalItems={filteredQueries.length} />
          </div>
        );
      }

      case "contacts": {
        const filteredContacts = getFilteredData(
          "contacts"
        ) as ContactSubmission[];
        const paginatedContacts = getPaginatedData(filteredContacts);
        return (
          <div>
            <TableHeader
              title="Contact Submissions"
              data={filteredContacts}
              filename="contacts"
              columns={[
                "Full Name",
                "Course",
                "City",
                "Phone Number",
                "Email",
                "Date",
              ]}
              searchValue={filters.contactFilter}
              onSearchChange={(value) =>
                handleFilterChange("contactFilter", value)
              }
            />
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Full Name
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Course
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        City
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone Number
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedContacts.map((contact) => (
                      <tr
                        key={contact._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                          <div className="truncate max-w-xs">
                            {contact.fullName}
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <Badge variant="outline">{contact.course}</Badge>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-600">
                          <div className="truncate max-w-xs">
                            {contact.city}
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-600">
                          {contact.phoneNumber}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-600">
                          <div className="truncate max-w-xs">
                            {contact.email || "N/A"}
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-600">
                          {formatDate(contact.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <PaginationComponent totalItems={filteredContacts.length} />
          </div>
        );
      }

      case "bookings": {
        const filteredBookings = getFilteredData(
          "bookings"
        ) as BookingSubmission[];
        const paginatedBookings = getPaginatedData(filteredBookings);
        return (
          <div>
            <TableHeader
              title="One-to-One Bookings"
              data={filteredBookings}
              filename="bookings"
              columns={[
                "Full Name",
                "Domain",
                "Booking Date",
                "Email",
                "Message",
                "Phone Number",
                "Time",
                "Date",
              ]}
              searchValue={filters.bookingFilter}
              onSearchChange={(value) =>
                handleFilterChange("bookingFilter", value)
              }
            />
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Full Name
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Domain
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Booking Date
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Message
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Submitted
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedBookings.map((booking, idx) => (
                      <tr
                        key={booking._id || idx}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                          <div className="truncate max-w-xs">
                            {booking.fullName}
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <Badge variant="outline">{booking.domain}</Badge>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-600">
                          {booking.date}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm text-gray-900 truncate max-w-xs">
                              {booking.email || "N/A"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.phoneNumber}
                            </div>
                          </div>
                        </td>
                        <td
                          className="px-4 sm:px-6 py-4 max-w-xs truncate text-gray-600"
                          title={booking.message}
                        >
                          {booking.message}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-600">
                          {booking.time}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-600">
                          {formatDate(booking.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <PaginationComponent totalItems={filteredBookings.length} />
          </div>
        );
      }

      case "offer": {
        return <OfferLetter />;
      }
      default:
        return <div>Section not found</div>;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    activeSection,
    filters, // filters object itself
    handleFilterChange, // stable callback
    getFilteredData, // stable memoized function
    getPaginatedData, // stable callback
    enrollments, // data for enrollments section
    memoizedEnrollmentFilters, // stable memoized component for enrollment filters
    selectedUser, // for modal
    isModalOpen, // for modal
    StatsCards, // memoized component
    formatDate,
    formatCurrency,
    // Note: Not including individual filter strings like filters.userFilter here
    // because getFilteredData already depends on them.
    // The goal is to make renderContent stable if its direct output structure doesn't change.
  ]);

  return (
    <div className="flex h-screen bg-gray-50">
      <Toaster position="top-right" />
      <Sidebar />
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
