import React from "react";

const ProjectTable = ({ companies }) => {
  return (
    <div className="overflow-x-auto bg-white p-6 rounded-lg shadow-lg">
      <table className="w-full border-collapse border border-gray-200 text-left text-sm text-gray-700">
        <thead className="bg-gray-50">
          <tr>
            <th className="border border-gray-300 px-4 py-2">ID No.</th>
            <th className="border border-gray-300 px-4 py-2">Company Name</th>
            <th className="border border-gray-300 px-4 py-2">Location</th>
            <th className="border border-gray-300 px-4 py-2">Category</th>
            <th className="border border-gray-300 px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="border border-gray-300 px-4 py-2">{company.id}</td>
              <td className="border border-gray-300 px-4 py-2">
                {company.name}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {company.location}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {company.category}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <button className="text-blue-500 hover:underline">Edit</button>{" "}
                |{" "}
                <button className="text-red-500 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectTable;
