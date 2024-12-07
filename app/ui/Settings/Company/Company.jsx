import React from "react";
import CompanyTable from "./CompanyTable";
import { useCompanyData } from "@/app/data/DataFetch";

export default function Company() {
  const { data: companies } = useCompanyData([]);
  console.log(companies);
  return <CompanyTable initialCompanies={companies} />;
}
