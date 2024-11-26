import React from "react";
import GroupTable from "./GroupTable";

const companies = [
  { id: "01", name: "Goinnovior Limited", location: "Dhaka", category: "Tech" },
  { id: "02", name: "Goinnovior Limited", location: "Dhaka", category: "Tech" },
  { id: "03", name: "Goinnovior Limited", location: "Dhaka", category: "Tech" },
  { id: "04", name: "Goinnovior Limited", location: "Dhaka", category: "Tech" },
  { id: "05", name: "Goinnovior Limited", location: "Dhaka", category: "Tech" },
  { id: "06", name: "Goinnovior Limited", location: "Dhaka", category: "Tech" },
];

export default function Group() {
  return <GroupTable initialCompanies={companies} />;
}
