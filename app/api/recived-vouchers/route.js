import { getRecivedVouchersFromAllYears } from '@/app/lib/Accounts/fetchRecivedVouchers';
import { getRecivedVoucher } from '@/app/lib/Accounts/recivedModal';
import { connectToDB } from '@/app/lib/connectToDB';

export async function GET() {
  try {
    const data = await getRecivedVouchersFromAllYears();
    return Response.json(data);
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectToDB();
    const body = await req.json();

    const date = new Date(body.date);
    const year = date.getFullYear();

    const Voucher = getRecivedVoucher(year);
    const savedVoucher = await Voucher.create(body);

    return Response.json({ success: true, data: savedVoucher });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
