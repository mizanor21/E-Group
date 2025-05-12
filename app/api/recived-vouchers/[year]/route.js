import { getRecivedVoucher } from "@/app/lib/Accounts/recivedModal";
import { connectToDB } from "@/app/lib/connectToDB";


export async function GET(req, { params }) {
  try {
    await connectToDB();
    const { year } = params;

    const Voucher = getRecivedVoucher(year);
    const data = await Voucher.find().sort({ date: -1 }).limit(100);

    return Response.json({ success: true, data });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
