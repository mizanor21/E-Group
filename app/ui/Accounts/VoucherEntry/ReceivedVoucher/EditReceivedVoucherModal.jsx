// app/components/EditReceivedVoucherModal.jsx
'use client'
import { useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { ChevronDown, X, Check, Trash2, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { expenseHeadOptions } from '../constants';

const EditReceivedVoucherModal = ({ voucher, onClose, onUpdate }) => {
  const { 
    control,
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isDirty }
  } = useForm();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'voucherRows'
  });

  // Initialize form with voucher data
  useEffect(() => {
    if (voucher) {
      reset({
        ...voucher,
        date: new Date(voucher.date).toISOString().split('T')[0]
      });
    }
  }, [voucher, reset]);

  const onSubmit = async (data) => {
    try {
      const response = await fetch(`/api/received-vouchers/${voucher.accountingPeriod.split('-')[0]}/${voucher._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Voucher updated successfully!');
        onUpdate(result.data);
        onClose();
      } else {
        toast.error(result.message || 'Failed to update voucher');
      }
    } catch (error) {
      toast.error('Error updating voucher');
      console.error('Update error:', error);
    }
  };

  const calculateTotal = () => {
    return fields.reduce((sum, _, index) => {
      const amount = parseFloat(watch(`voucherRows.${index}.amountBDT`) || 0);
      return sum + amount;
    }, 0).toFixed(2);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b p-4 sticky top-0 bg-white z-10">
          <h3 className="text-lg font-semibold">Edit Voucher - {voucher?.lastVoucher}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="space-y-1">
              <label className="block text-sm font-medium">Voucher Number</label>
              <input
                {...register('lastVoucher')}
                className="w-full p-2 border rounded-md bg-gray-50"
                readOnly
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium">Date</label>
              <input
                type="date"
                {...register('date')}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium">Status</label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <select {...field} className="w-full p-2 border rounded-md">
                    <option value={false}>Pending</option>
                    <option value={true}>Approved</option>
                  </select>
                )}
              />
            </div>
          </div>

          <div className="overflow-x-auto mb-6">
            <table className="min-w-full border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border text-left">Expense Head</th>
                  <th className="p-2 border text-left">Amount (BDT)</th>
                  <th className="p-2 border text-left">Paid To</th>
                  <th className="p-2 border text-left">Narration</th>
                  <th className="p-2 border text-left">Status</th>
                  <th className="p-2 border text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {fields.map((field, index) => (
                  <tr key={field.id}>
                    <td className="p-2 border">
                      <Controller
                        name={`voucherRows.${index}.expenseHead`}
                        control={control}
                        render={({ field }) => (
                          <select {...field} className="w-full p-1 border rounded">
                            {expenseHeadOptions.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        )}
                      />
                    </td>
                    <td className="p-2 border">
                      <input
                        {...register(`voucherRows.${index}.amountBDT`)}
                        className="w-full p-1 border rounded"
                        type="number"
                        step="0.01"
                      />
                    </td>
                    <td className="p-2 border">
                      <input
                        {...register(`voucherRows.${index}.paidTo`)}
                        className="w-full p-1 border rounded"
                      />
                    </td>
                    <td className="p-2 border">
                      <input
                        {...register(`voucherRows.${index}.narration`)}
                        className="w-full p-1 border rounded"
                      />
                    </td>
                    <td className="p-2 border">
                      <Controller
                        name={`voucherRows.${index}.status`}
                        control={control}
                        render={({ field }) => (
                          <select {...field} className="w-full p-1 border rounded">
                            <option value={false}>Pending</option>
                            <option value={true}>Approved</option>
                          </select>
                        )}
                      />
                    </td>
                    <td className="p-2 border">
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={1} className="p-2 border font-medium text-right">Total:</td>
                  <td className="p-2 border font-bold">{calculateTotal()}</td>
                  <td colSpan={4} className="p-2 border">
                    <button
                      type="button"
                      onClick={() => append({
                        expenseHead: '',
                        amountBDT: '',
                        paidTo: '',
                        narration: '',
                        status: false
                      })}
                      className="flex items-center text-blue-500 hover:text-blue-700"
                    >
                      <Plus size={16} className="mr-1" />
                      Add Row
                    </button>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isDirty}
              className={`px-4 py-2 rounded-md text-white ${isDirty ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400 cursor-not-allowed'}`}
            >
              <div className="flex items-center">
                <Check size={16} className="mr-1" />
                Save Changes
              </div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditReceivedVoucherModal;