'use client'
import { useForm, useFieldArray } from 'react-hook-form';
import { useState } from 'react';
import { BackwardIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { ArrowLeft, Backpack, BackpackIcon } from 'lucide-react';

export default function GroupForm() {
  const { register, control, handleSubmit } = useForm({
    defaultValues: {
      groups: [{
        groupName: '',
        companies: [{
          companyName: '',
          companyShortName: '',
          projects: [{
            projectName: ''
          }]
        }]
      }]
    }
  });

  const { fields: groupFields, append: appendGroup, remove: removeGroup } = useFieldArray({
    control,
    name: "groups"
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data.groups),
      });

      if (response.ok) {
        setSubmitSuccess(true);
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className=" p-6">
      <div className="text-2xl font-bold mb-6 flex item-center">
        <Link href={'/dashboard/settings'} className='text-2xl'><ArrowLeft /></Link> 
        <p>Project Management Form</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {groupFields.map((group, groupIndex) => (
          <div key={group.id} className="border rounded-lg p-4 bg-white">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Group {groupIndex + 1}</h2>
              <button
                type="button"
                onClick={() => removeGroup(groupIndex)}
                className="text-red-500 hover:text-red-700"
              >
                Remove Group
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Group Name</label>
                <input
                  {...register(`groups.${groupIndex}.groupName`)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <CompanyFields
              nestIndex={groupIndex}
              {...{ control, register }}
            />
          </div>
        ))}

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => appendGroup({
              groupName: '',
              companies: [{
                companyName: '',
                companyShortName: '',
                projects: [{
                  projectName: ''
                }]
              }]
            })}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add Group
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400"
          >
            {submitting ? 'Submitting...' : 'Submit Data'}
          </button>
        </div>

        {submitSuccess && (
          <div className="p-4 bg-green-100 text-green-800 rounded-md">
            Data submitted successfully!
          </div>
        )}
      </form>
    </div>
  );
}

function CompanyFields({ nestIndex, control, register }) {
  const { fields: companyFields, append: appendCompany, remove: removeCompany } = useFieldArray({
    control,
    name: `groups.${nestIndex}.companies`
  });

  return (
    <div className="space-y-4">
      {companyFields.map((company, companyIndex) => (
        <div key={company.id} className="border rounded-lg p-4 bg-white">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Company {companyIndex + 1}</h3>
            <button
              type="button"
              onClick={() => removeCompany(companyIndex)}
              className="text-red-500 hover:text-red-700"
            >
              Remove Company
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Company Name</label>
              <input
                {...register(`groups.${nestIndex}.companies.${companyIndex}.companyName`)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Company Short Name</label>
              <input
                {...register(`groups.${nestIndex}.companies.${companyIndex}.companyShortName`)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <ProjectFields
            nestIndex={nestIndex}
            companyIndex={companyIndex}
            {...{ control, register }}
          />
        </div>
      ))}

      <button
        type="button"
        onClick={() => appendCompany({
          companyName: '',
          companyShortName: '',
          projects: [{
            projectName: ''
          }]
        })}
        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Add Company
      </button>
    </div>
  );
}

function ProjectFields({ nestIndex, companyIndex, control, register }) {
  const { fields: projectFields, append: appendProject, remove: removeProject } = useFieldArray({
    control,
    name: `groups.${nestIndex}.companies.${companyIndex}.projects`
  });

  return (
    <div className="space-y-4">
      <h4 className="text-md font-medium">Projects</h4>

      {projectFields.map((project, projectIndex) => (
        <div key={project.id} className="border rounded-lg p-3 bg-gray-50">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Project {projectIndex + 1}</span>
            <button
              type="button"
              onClick={() => removeProject(projectIndex)}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Remove
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700">Project Name</label>
              <input
                {...register(`groups.${nestIndex}.companies.${companyIndex}.projects.${projectIndex}.projectName`)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => appendProject({
          projectName: ''
        })}
        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Add Project
      </button>
    </div>
  );
}