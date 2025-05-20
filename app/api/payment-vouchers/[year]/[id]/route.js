// app/api/payment-vouchers/[year]/[id]/route.js

import { getVoucherModelByYear } from '@/app/lib/Accounts/voucherModel';
import { connectToDB } from '@/app/lib/connectToDB';

export async function PATCH(req, { params }) {
  try {
    await connectToDB();
    const { year, id } = params;

    console.log("Year:", year);
    console.log("ID:", id);
    const updateData = await req.json();

    if (!id) {
      return new Response(JSON.stringify({
        success: false,
        message: "Voucher ID is required"
      }), { status: 400 });
    }

    if (Object.keys(updateData).length === 0) {
      return new Response(JSON.stringify({
        success: false,
        message: "No update data provided"
      }), { status: 400 });
    }

    const Voucher = getVoucherModelByYear(year);
    const updatedVoucher = await Voucher.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedVoucher) {
      return new Response(JSON.stringify({
        success: false,
        message: `Voucher with ID ${id} not found in ${year} collection`
      }), { status: 404 });
    }

    return new Response(JSON.stringify({
      success: true,
      data: updatedVoucher
    }), { status: 200 });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      message: error.message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    }), { status: 500 });
  }
}