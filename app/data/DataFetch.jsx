"use client";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const useCompanyData = () => {
  const { data, error } = useSWR(`${API_URL}/api/company`, fetcher);
  return { data, error, isLoading: !data && !error };
};

export const useProjectData = () => {
  const { data, error } = useSWR(`${API_URL}/api/projects`, fetcher);
  return { data, error, isLoading: !data && !error };
};

export const useGroupData = () => {
  const { data, error } = useSWR(`${API_URL}/api/group`, fetcher);
  return { data, error, isLoading: !data && !error };
};

export const useEmployeeData = () => {
  const { data, error } = useSWR(`${API_URL}/api/employees`, fetcher);
  return { data, error, isLoading: !data && !error };
};

export const useEmployeeDetailsData = ({ params }) => {
  const { data, error } = useSWR(
    params?.id ? `${API_URL}/api/employees/${params.id}` : null,
    fetcher
  );
  return { data, error, isLoading: !data && !error };
};

export const useSalaryData = () => {
  const { data, error } = useSWR(`${API_URL}/api/salary`, fetcher);
  return { data, error, isLoading: !data && !error };
};
