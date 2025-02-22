"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { updateEmployee } from "../actions/employee"

const formSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phoneNumber: z.string(),
  gender: z.string(),
  nationality: z.string(),
  department: z.string(),
  currentJob: z.string(),
  project: z.string(),
  experience: z.string(),
  employeeType: z.string(),
  presentAddress1: z.string(),
  presentCity: z.string(),
  presentDivision: z.string(),
  presentPostOrZipCode: z.string(),
  isSameAddress: z.boolean(),
  permanentAddress1: z.string().optional(),
  permanentCity: z.string().optional(),
  permanentDivision: z.string().optional(),
  foodAllowance: z.string(),
  transportAllowance: z.string(),
  telephoneAllowance: z.string(),
  dailyRate: z.string(),
  commission: z.string(),
  accommodation: z.string(),
})

export function EmployeeProfileForm({ employee, id }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phoneNumber: employee.phoneNumber,
      gender: employee.gender,
      nationality: employee.nationality,
      department: employee.department,
      currentJob: employee.currentJob,
      project: employee.project,
      experience: employee.experience.toString(),
      employeeType: employee.employeeType,
      presentAddress1: employee.presentAddress1,
      presentCity: employee.presentCity,
      presentDivision: employee.presentDivision,
      presentPostOrZipCode: employee.presentPostOrZipCode,
      isSameAddress: employee.isSameAddress,
      permanentAddress1: employee.permanentAddress1,
      permanentCity: employee.permanentCity,
      permanentDivision: employee.permanentDivision,
      foodAllowance: employee.foodAllowance.toString(),
      transportAllowance: employee.transportAllowance?.toString(),
      telephoneAllowance: employee.telephoneAllowance?.toString(),
      dailyRate: employee?.dailyRate?.toString(),
      commission: employee?.commission?.toString(),
      accommodation: employee.accommodation?.toString(),
    },
  })

  const onSubmit = async (data) => {
    try {
      setIsLoading(true)
      await updateEmployee(id, data)
      router.refresh()
    } catch (error) {
      console.error("Failed to update employee:", error)
    } finally {
      setIsLoading(false)
    }
  }
  


  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10 space-y-8"
      >
        {/* Form fields go here */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Employee Details</h2>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Profile"}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Info */}
          <div className="bg-gray-100 p-4 rounded-lg space-y-4">
            <h3 className="font-semibold text-gray-700">Personal Info</h3>

            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Job Info */}
          <div className="bg-gray-100 p-4 rounded-lg space-y-4">
            <h3 className="font-semibold text-gray-700">Job Details</h3>

            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currentJob"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="project"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Experience (years)</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Address Section */}
        <div className="bg-gray-100 p-4 rounded-lg space-y-4">
          <h3 className="font-semibold text-gray-700">Address</h3>

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="presentAddress1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Present Address</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="presentCity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="presentDivision"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Division</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="presentPostOrZipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postal Code</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name="isSameAddress"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Same as Permanent Address</FormLabel>
                </div>
              </FormItem>
            )}
          />
        </div>

        {/* Allowances Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-100 p-4 rounded-lg space-y-4">
            <h3 className="font-semibold text-gray-700">Allowances</h3>

            <FormField
              control={form.control}
              name="foodAllowance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Food Allowance ($)</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="transportAllowance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transport Allowance ($)</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="telephoneAllowance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telephone Allowance ($)</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="bg-gray-100 p-4 rounded-lg space-y-4">
            <h3 className="font-semibold text-gray-700">Financials</h3>

            <FormField
              control={form.control}
              name="dailyRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Daily Rate ($)</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="commission"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Commission (%)</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="accommodation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Accommodation ($)</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </form>
    </Form>
  )
}