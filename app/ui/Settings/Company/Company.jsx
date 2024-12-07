import React from "react";
import CompanyTable from "./CompanyTable";
import { useCompanyData } from "@/app/data/DataFetch";

export default function Company() {
  const { data: companies } = useCompanyData([]);
  return <CompanyTable initialCompanies={companies} />;
}
