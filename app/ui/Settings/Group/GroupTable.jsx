"use client";
import React, { useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import GroupModal from "./GModal";
import Swal from "sweetalert2";
import axios from "axios";
import toast from "react-hot-toast";
import { useLoginUserData } from "@/app/data/DataFetch";

const GroupTable = ({ groupsData = [] }) => {
  const {data} = useLoginUserData([])
  const [groups, setGroups] = useState(groupsData); // group data
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Default rows per page
  const [searchQuery, setSearchQuery] = useState("");
  const [modalData, setModalData] = useState(null); // For modal data
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal open state

  // Pagination Logic
  const filteredGroups = groups.filter((group) =>
    Object.values(group)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filteredGroups.length / rowsPerPage);
  const startRow = (currentPage - 1) * rowsPerPage;

  // Filter and paginate the displayed groups
  const displayedGroups = filteredGroups.slice(
    startRow,
    startRow + rowsPerPage
  );

  // Handle Rows per Page Change
  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page
  };

  // Open Add group Modal
  const handleAddGroup = () => {
    setModalData(null); // Reset modal data
    setIsModalOpen(true); // Open modal
  };

  // Open Edit group Modal
  const handleEditGroup = (group) => {
    setModalData(group); // Set data to edit
    setIsModalOpen(true); // Open modal
  };

  // Handle Save group (Add or Edit)
  const handleSaveGroup = (newData) => {
    if (newData._id) {
      // Edit existing group
      setGroups((prevGroups) =>
        prevGroups.map((group) =>
          group._id === newData._id ? newData : group
        )
      );
    } else {
      // Add new group
      setGroups((prevGroups) => [...prevGroups, newData]);
    }
    setIsModalOpen(false); // Close modal
  };

  // Close Modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalData(null);
  };

  // Generate PDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    // Define table columns
    const tableColumn = ["ID", "Group Name", "Location", "Category"];
    // Define table rows
    const tableRows = groups.map((group) => [
      group._id || "N/A", // Use _id or a placeholder if not available
      group.group || "N/A",
      group.location || "N/A",
      group.category || "N/A",
    ]);

    // Add title to the PDF
    doc.text("Group List", 14, 15);

    // Generate the table using jspdf-autotable
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    // Save the PDF
    doc.save("group_list.pdf");
  };

  // Handle user deletion with toast notification
  const handleDelete = (id) => {
    // Show confirmation dialog
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Make API call to delete
          await axios.delete(`/api/group?id=${id}`);
          setGroups((prevGroups) =>
            prevGroups.filter((group) => group._id !== id)
          ); // Update the state

          // Show success alert
          Swal.fire({
            title: "Deleted!",
            text: "The group has been deleted.",
            icon: "success",
          });
        } catch (error) {
          // Handle error
          toast.error("Failed to delete group. Please try again.");
        }
      }
    });
  };

  return (
    <div className="rounded-lg space-y-5">
      {/* Header Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm grid grid-cols-4 ">
        <div className="relative col-span-2">
          <label htmlFor="search" className="text-sm font-medium text-gray-600">
            Super Search
          </label>
          <div className="relative mt-2">
            <input
              type="text"
              id="search"
              placeholder="Search by any field"
              className="border px-4 py-2 pl-10 rounded-lg shadow-sm focus:ring focus:ring-blue-200 w-full"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="absolute left-3 top-3 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-4.35-4.35M15 11a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </span>
          </div>
        </div>

        <div className="flex items-center justify-end col-span-2">
          <button
            onClick={handleDownloadPDF}
            className="mr-5 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:from-green-600 hover:to-green-700 transition"
          >
            Download All as PDF
          </button>
          {
            data?.permissions?.settings?.create && (
              <button
                onClick={handleAddGroup}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 transition"
              >
                Add New group
              </button>
            )
          }
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-800">All groups</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Showing</span>
            <select
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              className="border px-4 py-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
            <span className="text-sm text-gray-600">per page</span>
          </div>
        </div>
        <table className="w-full text-left border-collapse bg-white rounded-lg">
          <thead>
            <tr className="bg-blue-100 text-gray-800">
              <th className="py-2 px-4">ID No.</th>
              <th className="py-2 px-4">Group Name</th>
              <th className="py-2 px-4">Location</th>
              <th className="py-2 px-4">Category</th>
              <th className="py-2 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {displayedGroups.length > 0 ? (
              displayedGroups.map((group, index) => (
                <tr key={group._id} className="border-t hover:bg-gray-100">
                  <td className="py-2 px-4">{startRow + index + 1}</td>
                  <td className="py-2 px-4">{group.group}</td>
                  <td className="py-2 px-4">{group.location}</td>
                  <td className="py-2 px-4">{group.category}</td>
                  <td className="py-2 px-4">
                    {
                      data?.permissions?.settings?.edit && (
                        <button
                          onClick={() => handleEditGroup(group)}
                          className="text-blue-500 hover:underline"
                        >
                          Edit
                        </button>
                      )
                    }
                    {" "}
                    {
                      data?.permissions?.settings?.delete && (
                        <button
                          onClick={() => handleDelete(group._id)}
                          className="text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      )
                    }
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-4 text-gray-500 italic"
                >
                  No groups found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg ${
              currentPage === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Previous
          </button>
          <div className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, pageIndex) => (
              <button
                key={pageIndex}
                onClick={() => setCurrentPage(pageIndex + 1)}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === pageIndex + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {pageIndex + 1}
              </button>
            ))}
          </div>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Next
          </button>
        </div>
      </div>

      {/* group Modal */}
      {isModalOpen && (
        <GroupModal
          data={modalData}
          onClose={handleCloseModal}
          onSave={handleSaveGroup}
        />
      )}
    </div>
  );
};

export default GroupTable;