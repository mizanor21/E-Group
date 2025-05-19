import { getVoucherModelByYear } from "@/app/lib/Accounts/voucherModel";
import { connectToDB } from "@/app/lib/connectToDB";


export async function GET(req, { params }) {
  try {
    await connectToDB();
    const { year } = params;

    const Voucher = getVoucherModelByYear(year);
    const data = await Voucher.find().sort({ date: -1 }).limit(100);

    return Response.json(data);
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}

// app/api/received-vouchers/[year]/route.js
export async function DELETE(req, { params }) {
  try {
    await connectToDB();
    const { year } = params;
    
    // Get ID from either URL search params or request body
    const url = new URL(req.url);
    const id = url.searchParams.get('id') || (await req.json())._id;

    if (!id) {
      return Response.json(
        { success: false, message: "Voucher ID is required as either query parameter (?id=) or request body (_id)" },
        { status: 400 }
      );
    }

    const Voucher = getVoucherModelByYear(year);
    const deletedVoucher = await Voucher.findByIdAndDelete(id);

    if (!deletedVoucher) {
      return Response.json(
        { success: false, message: `Voucher with ID ${id} not found in ${year} collection` },
        { status: 404 }
      );
    }

    return Response.json({ 
      success: true, 
      message: "Voucher deleted successfully",
      deletedId: id 
    });
  } catch (error) {
    return Response.json(
      { 
        success: false, 
        message: error.message,
        hint: "Ensure you're using a valid 24-character MongoDB ID" 
      },
      { status: 500 }
    );
  }
}