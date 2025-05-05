import { getVoucherModelByYear } from "@/app/lib/Accounts/voucherModel";
import { connectToDB } from "@/app/lib/connectToDB";


export async function GET(req, { params }) {
  try {
    await connectToDB();
    const { year } = params;

    const Voucher = getVoucherModelByYear(year);
    const data = await Voucher.find().sort({ date: -1 }).limit(100);

    return Response.json({ success: true, data });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
