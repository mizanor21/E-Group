"use client";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

export const useCompanyData = () => {
  const { data, error } = useSWR("http://localhost:3000/api/company", fetcher);
  return { data, error, isLoading: !data && !error };
};

export const useProjectData = () => {
  const { data, error } = useSWR("http://localhost:3000/api/projects", fetcher);
  return { data, error, isLoading: !data && !error };
};

export const useGroupData = () => {
  const { data, error } = useSWR("http://localhost:3000/api/group", fetcher);
  return { data, error, isLoading: !data && !error };
};

export const useEmployeeData = () => {
  const { data, error } = useSWR(
    "http://localhost:3000/api/employees",
    fetcher
  );
  return { data, error, isLoading: !data && !error };
};

export const useEmployeeDetailsData = ({ params }) => {
  const { data, error } = useSWR(
    params?.id ? `http://localhost:3000/api/employees/${params.id}` : null,
    fetcher
  );
  return { data, error, isLoading: !data && !error };
};

export const useSalaryData = () => {
  const { data, error } = useSWR(`http://localhost:3000/api/salary`, fetcher);
  return { data, error, isLoading: !data && !error };
};
