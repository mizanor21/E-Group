import TodayReceivedVouchersTable from "../ReceivedVoucher/TodayReceivedVouchersTable";
import TodayVouchersTable from "../PaymentsVoucher/TodayPaymentsVouchersTable";

const VoucherList = () => {
    return(
        <div className="bg-slate-50 min-h-screen p-4">
            <h1 className="text-2xl font-bold mb-4">Voucher List</h1>
            <TodayVouchersTable />
            <TodayReceivedVouchersTable />
            
        </div>
    )
}

export default VoucherList;