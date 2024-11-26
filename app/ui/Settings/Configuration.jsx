"use client";
import React, { useState } from "react";
import Company from "./Company/Company";
import Group from "./Group/Group";
import Project from "./Project/Project";

const Configuration = () => {
  const [activeTab, setActiveTab] = useState("company"); // Manage active tab

  return (
    <div className="">
      <h3 className="text-2xl font-bold text-gray-800 mb-4 tracking-wide">
        Configuration
      </h3>
      <div className="bg-gray-50 p-6 rounded-lg shadow-lg">
        {/* Tabs */}
        <div className="flex gap-6 border-b pb-2 mb-6 text-gray-600">
          <button
            onClick={() => setActiveTab("company")}
            className={`${
              activeTab === "company"
                ? "border-b-4 border-blue-500 text-blue-500"
                : "hover:text-blue-500"
            } pb-2 font-medium`}
          >
            Company
          </button>
          <button
            onClick={() => setActiveTab("project")}
            className={`${
              activeTab === "project"
                ? "border-b-4 border-blue-500 text-blue-500"
                : "hover:text-blue-500"
            } pb-2 font-medium`}
          >
            Project Name
          </button>
          <button
            onClick={() => setActiveTab("group")}
            className={`${
              activeTab === "group"
                ? "border-b-4 border-blue-500 text-blue-500"
                : "hover:text-blue-500"
            } pb-2 font-medium`}
          >
            Group
          </button>
        </div>

        {/* Render Components Based on Active Tab */}
        {activeTab === "company" && <Company />}
        {activeTab === "project" && <Project />}
        {activeTab === "group" && <Group />}
      </div>
    </div>
  );
};

export default Configuration;
