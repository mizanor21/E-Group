"use client";
import {
  useCompanyData,
  useEmployeeData,
  useProjectData,
} from "@/app/data/DataFetch";
import DashboardSection from "./DashboardSection";

const feed = [
  {
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "Marvin McKinney",
    action: "applied for the job",
    target: "Product Designer",
    time: "10 mins ago",
    badge: "Applying",
    badgeColor: "bg-blue-100 text-blue-600",
  },
];

const meetings = [
  {
    day: "Mon",
    date: "10",
    title: "Interview",
    time: "9:00 am – 11:30 am",
  },
];

const payments = [
  {
    memoTitle: "Operations memo",
    sentFrom: "Otor John",
    sentTo: "Ibrahim Sadiq",
    status: "Pending",
  },
];

// const employees = [
//   {
//     name: "Abubakar Ismaila Goje",
//     role: "Admin",
//     designation: "Human Resource Dept.",
//   },
// ];

export default function Dashboard() {
  const { data: allEmployees } = useEmployeeData([]);
  const { data: Companies } = useCompanyData([]);
  const { data: Projects } = useProjectData([]);
  const stats = [
    {
      title: "Total Employee",
      value: allEmployees?.length || "0", // Use data length dynamically
      percentage: "14",
      bgFrom: "#f97316", // Orange-400
      bgTo: "#ea580c", // Orange-500
      icon: "👥",
    },
    {
      title: "Total Projects",
      value: Projects?.length || "0",
      percentage: "14",
      bgFrom: "#ef4444", // Red-400
      bgTo: "#dc2626", // Red-500
      icon: "📂",
    },
    {
      title: "Total Company",
      value: Companies?.length || "0",
      percentage: "14",
      bgFrom: "#3b82f6", // Blue-400
      bgTo: "#2563eb", // Blue-500
      icon: "🏢",
    },
  ];
  return (
    <DashboardSection
      stats={stats}
      feed={feed}
      meetings={meetings}
      payments={payments}
      employees={allEmployees}
      // employeeData={data}
    />
  );
}
