import PaymentVoucherByYear from "@/app/ui/Accounts/VoucherApproval/PaymentsVoucher/PaymentVoucherByYear"
import ReceivedVoucherByYear from "@/app/ui/Accounts/VoucherApproval/ReceivedVoucher/ReceivedVoucherByYear"

const page = () => {
    return (
        <div className="">
            <PaymentVoucherByYear/>
            <ReceivedVoucherByYear/>
        </div>
    )
}

export default page