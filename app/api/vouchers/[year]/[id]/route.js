import { getVoucherModelByYear } from "@/app/lib/Accounts/voucherModel";
import { connectToDB } from "@/app/lib/connectToDB";


export async function PATCH(request, { params }) {
  try {
    await connectToDB();
    const { year, id } = params;
    const updates = await request.json();

    // Get the correct model for the year
    const Voucher = getVoucherModelByYear(year);

    // Validate updates
    if (!updates || (updates.status !== undefined && typeof updates.status !== 'boolean')) {
      return Response.json({ error: 'Invalid update data' }, { status: 400 });
    }

    // Handle voucher rows updates
    if (updates.voucherRows) {
      const voucher = await Voucher.findById(id);
      if (!voucher) {
        return Response.json({ error: 'Voucher not found' }, { status: 404 });
      }

      // Merge existing rows with updates
      const updatedRows = voucher.voucherRows.map(row => {
        const rowUpdate = updates.voucherRows.find(r => r._id?.toString() === row._id.toString());
        return rowUpdate ? { ...row.toObject(), ...rowUpdate } : row;
      });

      updates.voucherRows = updatedRows;
    }

    const updatedVoucher = await Voucher.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true }
    );

    if (!updatedVoucher) {
      return Response.json({ error: 'Voucher not found' }, { status: 404 });
    }

    return Response.json(updatedVoucher);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}