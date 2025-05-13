import { getTodayCreatedVouchersFromAllYears } from '@/app/lib/Accounts/fetchVouchersTodayByCreatedAt';
import { getVoucherModelByYear } from '@/app/lib/Accounts/voucherModel';
import { connectToDB } from '@/app/lib/connectToDB';

export async function GET() {
  try {
    const vouchers = await getTodayCreatedVouchersFromAllYears();
    return Response.json({ success: true, data: vouchers });
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

    const Voucher = getVoucherModelByYear(year);
    const savedVoucher = await Voucher.create(body);

    return Response.json({ success: true, data: savedVoucher });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
