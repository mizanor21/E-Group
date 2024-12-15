import React from "react";
import GroupTable from "./GroupTable";

const companies = [
  {
    id: "01",
    group: "Goinnovior Limited",
    location: "Dhaka",
    category: "Tech",
  },
  {
    id: "02",
    group: "Goinnovior Limited",
    location: "Dhaka",
    category: "Tech",
  },
  {
    id: "03",
    group: "Goinnovior Limited",
    location: "Dhaka",
    category: "Tech",
  },
  {
    id: "04",
    group: "Goinnovior Limited",
    location: "Dhaka",
    category: "Tech",
  },
  {
    id: "05",
    group: "Goinnovior Limited",
    location: "Dhaka",
    category: "Tech",
  },
  {
    id: "06",
    group: "Goinnovior Limited",
    location: "Dhaka",
    category: "Tech",
  },
];

export default function Group() {
  // const { data } = useCompanyData([]);
  return <GroupTable groupsData={companies} />;
}
