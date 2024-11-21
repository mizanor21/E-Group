import Dashboard from "./Dashboard";

const stats = [
  {
    title: "Total Employee",
    value: "234",
    percentage: "14",
    bgFrom: "orange-400",
    bgTo: "orange-500",
    icon: "👥",
  },
  {
    title: "Total Projects",
    value: "3567",
    percentage: "14",
    bgFrom: "red-400",
    bgTo: "red-500",
    icon: "📂",
  },
  {
    title: "Total Company",
    value: "2145",
    percentage: "14",
    bgFrom: "blue-400",
    bgTo: "blue-500",
    icon: "🏢",
  },
];

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

const employees = [
  {
    name: "Abubakar Ismaila Goje",
    role: "Admin",
    designation: "Human Resource Dept.",
  },
];

export default function DashboardPage() {
  return (
    <Dashboard
      stats={stats}
      feed={feed}
      meetings={meetings}
      payments={payments}
      employees={employees}
    />
  );
}
