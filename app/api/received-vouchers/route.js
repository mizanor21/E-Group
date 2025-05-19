import { getTodayCreatedReceivedVouchersFromAllYears } from '@/app/lib/Accounts/fetchRecivedVouchersToday';
import { getRecivedVoucher } from '@/app/lib/Accounts/recivedModal';
import { connectToDB } from '@/app/lib/connectToDB';

export async function GET() {
  try {
    const data = await getTodayCreatedReceivedVouchersFromAllYears();
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

export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    await connectToDB();
    const deleted = await getTodayCreatedReceivedVouchersFromAllYears.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { message: " data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: " data deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to delete  data" },
      { status: 500 }
    );
  }
}
