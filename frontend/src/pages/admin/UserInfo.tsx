/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  FiDownload,
  FiX,
  FiUser,
  FiMail,
  FiCalendar,
  FiBook,
  FiBriefcase,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import jsPDF from "jspdf";
import "jspdf-autotable";

const UserInfo = ({ allUser }: any) => {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState<any>(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(5); // Default 10 users per page

  const formatDate = (dateString: any) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Calculate pagination values
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = allUser.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(allUser.length / usersPerPage);

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
    const maxPageButtons = 5; // Show max 5 page buttons at a time

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

  const exportToPDF = () => {
    const doc: any = new jsPDF();

    // Add title
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text("User Registration Report", 20, 20);

    // Add generation date
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 30);

    // Add summary
    doc.setFontSize(12);
    doc.setTextColor(40, 40, 40);
    doc.text(`Total Users: ${allUser.length}`, 20, 40);

    // Prepare table data
    const tableColumn = ["Name", "Email", "Join Date", "Enrollments"];
    const tableRows = allUser.map((user: any) => [
      `${user.firstName} ${user.lastName}`,
      user.email,
      formatDate(user.createdAt),
      user.enrollments.length,
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

    // Add footer
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

    // Save the PDF
    doc.save("user-registrations.pdf");
  };

  const exportToCSV = () => {
    const headers = ["Name", "Email", "Join Date", "Enrollments"];
    const userData = allUser.map((user: any) => [
      `${user.firstName} ${user.lastName}`,
      user.email,
      formatDate(user.createdAt),
      user.enrollments.length,
    ]);

    const csvContent = [
      headers.join(","),
      ...userData.map((row: any) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4">
      {/* Export Buttons */}
      <div className="mb-4 flex gap-4">
        <button
          onClick={exportToPDF}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          <FiDownload /> Export as PDF
        </button>
        <button
          onClick={exportToCSV}
          className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
        >
          <FiDownload /> Export as CSV
        </button>
      </div>

      {/* Rest of the component remains the same */}
      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Join Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Enrollments
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentUsers.map((user: any) => (
                <tr
                  key={user._id}
                  onClick={() => {
                    setSelectedUser(user);
                    setIsModalOpen(true);
                  }}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          {user.firstName.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.enrollments.length}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="flex items-center">
            <span className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">{indexOfFirstUser + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(indexOfLastUser, allUser.length)}
              </span>{" "}
              of <span className="font-medium">{allUser.length}</span> users
            </span>

            {/* Items per page selector */}
            <div className="ml-4">
              <select
                className="border rounded px-2 py-1 text-sm"
                value={usersPerPage}
                onChange={(e) => {
                  setUsersPerPage(Number(e.target.value));
                  setCurrentPage(1); // Reset to first page when changing items per page
                }}
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={25}>25 per page</option>
                <option value={50}>50 per page</option>
              </select>
            </div>
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

            {/* Page number buttons */}
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
      </div>

      {/* User Details Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">User Details</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <FiUser className="text-blue-500" />
                    <span className="font-medium">Name:</span>
                    <span>
                      {selectedUser.firstName} {selectedUser.lastName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiMail className="text-blue-500" />
                    <span className="font-medium">Email:</span>
                    <span>{selectedUser.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiCalendar className="text-blue-500" />
                    <span className="font-medium">Joined:</span>
                    <span>{formatDate(selectedUser.createdAt)}</span>
                  </div>
                </div>

                {/* Enrollments */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <FiBook className="text-blue-500" />
                    Enrollments
                  </h3>
                  {selectedUser.enrollments.length > 0 ? (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="space-y-3">
                        {selectedUser.enrollments.map((enrollment: any) => (
                          <div
                            key={enrollment._id}
                            className="flex items-center gap-3"
                          >
                            {enrollment.type === "course" ? (
                              <FiBook className="text-blue-500" />
                            ) : (
                              <FiBriefcase className="text-green-500" />
                            )}
                            <span className="capitalize">
                              {enrollment.type}
                            </span>
                            <span className="text-gray-500">
                              ID: {enrollment.item}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500">No enrollments yet</p>
                  )}
                </div>

                {/* Last Updated */}
                <div className="text-sm text-gray-500 pt-4 border-t">
                  Last updated: {formatDate(selectedUser.updatedAt)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
