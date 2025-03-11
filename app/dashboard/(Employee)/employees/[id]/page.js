import EmployeeProfileUpdate from "@/app/ui/Employees/AddEmployee/components/employee-profile"

export default async function EmployeeProfile({ params }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employees/${params.id}`, {
    next: { revalidate: 10 },
  })

  if (!res.ok) {
    return <div className="text-red-500 text-center py-4">Failed to load employee data</div>
  }

  const employee = await res.json()

  return <EmployeeProfileUpdate employeeData={employee} employeeId={params.id} />
}

