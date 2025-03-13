'use client'
import { useLoginUserData } from "@/app/data/DataFetch";
import ErrorPage from "@/app/ui/component/Error";
import AddEmployee from "@/app/ui/Employees/AddEmployee/components/AddEmployee";
import React from "react";

const Page = () => {
  const {data} = useLoginUserData([])
  
  return (
    <div>
      {data?.permissions?.employee?.create ? <AddEmployee /> : <ErrorPage />}
    </div>
  );
};

export default Page;
