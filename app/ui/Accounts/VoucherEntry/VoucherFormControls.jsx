'use client'
import { Controller, useFormContext } from "react-hook-form";
import { ChevronDown } from "lucide-react";
import DateSelector from "../../component/DateSelector/DateSelector";
import { useEffect } from "react";
import { useProjectData } from "@/app/data/DataFetch";

export const VoucherFormHeader = ({ control, register, watch, setValue }) => {
  const { data } = useProjectData([]);

  const selectedGroup = watch("group");
  const selectedCompany = watch("company");
  const selectedProject = watch("project");

  // Extract unique group names from the data
  const groupOptions = [
    { value: "", label: "Select Group" },
    ...(data?.map((group) => ({
      value: group.groupName,
      label: group.groupName,
    })) || []),
  ];

  // Get companies for selected group
  const companiesForSelectedGroup = data?.find(group => group.groupName === selectedGroup)?.companies || [];

  // Create company options
  const companyOptions = [
    { value: "", label: "Select Company" },
    ...companiesForSelectedGroup.map(company => ({
      value: company.companyName,
      label: company.companyName,
      shortName: company.companyShortName
    }))
  ];

  // Get projects for selected company
  const projectsForSelectedCompany = companiesForSelectedGroup
    .find(company => company.companyName === selectedCompany)?.projects || [];

  // Create project options
  const projectOptions = [
    { value: "", label: "Select Project" },
    ...projectsForSelectedCompany.map(project => ({
      value: project.projectName,
      label: project.projectName
    }))
  ];

  // Clear dependent fields when parent changes
  useEffect(() => {
    if (selectedGroup) {
      setValue("company", "");
      setValue("project", "");
    }
  }, [selectedGroup, setValue]);

  useEffect(() => {
    if (selectedCompany) {
      setValue("project", "");
    }
  }, [selectedCompany, setValue]);

  return (
    <>
      {/* Form Header - Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <Controller
          name="group"
          control={control}
          rules={{ required: "Group is required" }}
          render={({ field, fieldState: { error } }) => (
            <div className="w-full space-y-1">
              <label className="block text-sm">
                Group <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  {...field}
                  className={`w-full p-2 border rounded-md appearance-none ${
                    error ? 'border-red-300' : 'border-green-300'
                  } focus:outline-none focus:ring-1 focus:ring-green-500`}
                >
                  {groupOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-500" />
                {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
              </div>
            </div>
          )}
        />

        <Controller
          name="company"
          control={control}
          rules={{ required: "Company is required" }}
          render={({ field, fieldState: { error } }) => (
            <div className="w-full space-y-1">
              <label className="block text-sm">
                Company <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  {...field}
                  className={`w-full p-2 border rounded-md appearance-none ${
                    error ? 'border-red-300' : 'border-green-300'
                  } focus:outline-none focus:ring-1 focus:ring-green-500`}
                  disabled={!selectedGroup}
                >
                  {companyOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-500" />
                {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
              </div>
            </div>
          )}
        />

        <Controller
          name="project"
          control={control}
          rules={{ required: "Project is required" }}
          render={({ field, fieldState: { error } }) => (
            <div className="w-full space-y-1">
              <label className="block text-sm">
                Project <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  {...field}
                  className={`w-full p-2 border rounded-md appearance-none ${
                    error ? 'border-red-300' : 'border-green-300'
                  } focus:outline-none focus:ring-1 focus:ring-green-500`}
                  disabled={!selectedCompany}
                >
                  {projectOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-500" />
                {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
              </div>
            </div>
          )}
        />

        <Controller
          name="branch"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <div className="w-full space-y-1">
              <label className="block text-sm">
                Branch <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  {...field}
                  className={`w-full p-2 border rounded-md appearance-none ${
                    error ? 'border-red-300' : 'border-green-300'
                  } focus:outline-none focus:ring-1 focus:ring-green-500`}
                >
                  <option value="Mirpur DOHS">Mirpur DOHS</option>
                  <option value="Dhanmondi">Dhanmondi</option>
                  <option value="Gulshan">Gulshan</option>
                </select>
                <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-500" />
              </div>
              {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
            </div>
          )}
        />

        <Controller
          name="transitionType"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <div className="w-full space-y-1">
              <label className="block text-sm">
                Transition Type <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  {...field}
                  className={`w-full p-2 border rounded-md appearance-none ${
                    error ? 'border-red-300' : 'border-green-300'
                  } focus:outline-none focus:ring-1 focus:ring-green-500`}
                >
                  <option value="Bank Payment">Bank Payment</option>
                  <option value="Cash Payment">Cash Payment</option>
                  <option value="Transfer">Transfer</option>
                </select>
                <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-500" />
              </div>
              {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
            </div>
          )}
        />

        <Controller
          name="accountingPeriod"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <div className="w-full space-y-1">
              <label className="block text-sm">
                Accounting Period <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  {...field}
                  className={`w-full p-2 border rounded-md appearance-none ${
                    error ? 'border-red-300' : 'border-green-300'
                  } focus:outline-none focus:ring-1 focus:ring-green-500`}
                >
                  {Array.from({ length: 2075 - 2023 + 1 }, (_, i) => (
                    <option key={i} value={`${2023 + i}-${2024 + i}`}>
                      {2023 + i}-{2024 + i}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-500" />
              </div>
              {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
            </div>
          )}
        />

        <Controller
          name="currency"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <div className="w-full space-y-1">
              <label className="block text-sm">
                Currency <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  {...field}
                  className={`w-full p-2 border rounded-md appearance-none ${
                    error ? 'border-red-300' : 'border-green-300'
                  } focus:outline-none focus:ring-1 focus:ring-green-500`}
                >
                  <option value="BDT">BDT</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
                <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-500" />
              </div>
              {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
            </div>
          )}
        />

        <DateSelector
          control={control}
          name="date"
          label="Select Date"
          watch={watch}
        />

        <Controller
          name="paidFromBank"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <div className="w-full space-y-1">
              <label className="block text-sm">
                Paid From Bank <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  {...field}
                  className={`w-full p-2 border rounded-md appearance-none ${
                    error ? 'border-red-300' : 'border-green-300'
                  } focus:outline-none focus:ring-1 focus:ring-green-500`}
                >
                  <option value="Petty Cash">Petty Cash</option>
                  <option value="Main Account">Main Account</option>
                </select>
                <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-500" />
              </div>
              {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
            </div>
          )}
        />

        <div className="space-y-1">
          <label className="block text-sm">
            Balance
          </label>
          <p className="w-full p-2 border rounded-md border-green-300 bg-gray-50">
            {watch("paidFromBank") === "Petty Cash" ? "100,000 BDT" : "3,000,000 BDT"}
          </p>
        </div>

        <div className="space-y-1">
          <label className="block text-sm">
            Transaction No
          </label>
          <input
            {...register("lastVoucher")}
            readOnly
            className="w-full p-2 border rounded-md border-green-300 bg-gray-50"
          />
        </div>
      </div>
    </>
  );
};