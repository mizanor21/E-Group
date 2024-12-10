import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

export const useCompanyData = () => {
  const { data, error } = useSWR("http://localhost:3000/api/company", fetcher);
  return { data, error, isLoading: !data && !error };
};
