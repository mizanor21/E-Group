import { useFormContext } from "react-hook-form"
import { DocumentIcon, IdentificationIcon, HomeIcon } from "@heroicons/react/24/outline"

const FileInput = ({ id, label, icon: Icon, accept, validation, error }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <div
      className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
      <div className="space-y-1 text-center">
        <Icon className="mx-auto h-12 w-12 text-gray-400" />
        <div className="flex text-sm text-gray-600">
          <label
            htmlFor={id}
            className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
            <span>Upload a file</span>
            <input id={id} type="file" className="sr-only" accept={accept} {...validation} />
          </label>
          <p className="pl-1">or drag and drop</p>
        </div>
        <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
      </div>
    </div>
    {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
  </div>
)

const Documents = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  return (
    (<div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Documents</h2>
      <div className="space-y-6">
        <FileInput
          id="resume"
          label="Resume"
          icon={DocumentIcon}
          accept=".pdf,.doc,.docx"
          validation={register("resume", { required: "Resume is required" })}
          error={errors.resume} />
        <FileInput
          id="idProof"
          label="ID Proof"
          icon={IdentificationIcon}
          accept=".pdf,.jpg,.jpeg,.png"
          validation={register("idProof", { required: "ID proof is required" })}
          error={errors.idProof} />
        <FileInput
          id="addressProof"
          label="Address Proof"
          icon={HomeIcon}
          accept=".pdf,.jpg,.jpeg,.png"
          validation={register("addressProof", { required: "Address proof is required" })}
          error={errors.addressProof} />
      </div>
    </div>)
  );
}

export default Documents

