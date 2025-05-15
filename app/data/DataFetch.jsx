"use client";
import { auth } from "@/firebase.config";
import { useAuthState } from "react-firebase-hooks/auth";
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

export const useEmployeeRequiredFieldData = () => {
  const { data, error } = useSWR(`${API_URL}/api/required-field`, fetcher);
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

export const useIncomeData = () => {
  const { data, error } = useSWR(`${API_URL}/api/income`, fetcher);
  return { data, error, isLoading: !data && !error };
};
export const useExpensesData = () => {
  const { data, error } = useSWR(`${API_URL}/api/expenses`, fetcher);
  return { data, error, isLoading: !data && !error };
};
export const useInvestmentData = () => {
  const { data, error } = useSWR(`${API_URL}/api/investments`, fetcher);
  return { data, error, isLoading: !data && !error };
};
export const useWithdrawData = () => {
  const { data, error } = useSWR(`${API_URL}/api/withdraw`, fetcher);
  return { data, error, isLoading: !data && !error };
};
export const useUsersData = () => {
  const { data, error, mutate } = useSWR(`${API_URL}/api/user`, fetcher);
  return { 
    data, 
    error, 
    isLoading: !data && !error,
    mutate // Make sure to return mutate
  };
};
export const useLoginUserData = () => {
  const [loginUser] = useAuthState(auth);
  const shouldFetch = loginUser?.email ? `${API_URL}/api/user?email=${loginUser?.email}` : null;
  const { data, error } = useSWR(shouldFetch, fetcher);

  return { data, error, isLoading: !data && !error };
};

export const usePaymentVouchersData = () => {
  const { data, error, mutate } = useSWR(`${API_URL}/api/vouchers`, fetcher);
  return { data, error, isLoading: !data && !error, mutate };
};

export const useReceivedVouchersData = () => {
  const { data, error, mutate } = useSWR(`${API_URL}/api/recived-vouchers`, fetcher);
  return { data, error, isLoading: !data && !error, mutate };
}