import mongoose from 'mongoose';

const recivedVoucherSchema = new mongoose.Schema({
  group: String,
  company: String,
  project: String,
  transitionType: String,
  accountingPeriod: String,
  currency: String,
  lastVoucher: String,
  date: Date,
  receivedFrom: String,
  cashCurrentBalance: String,
  status: { type: Boolean, default: false },
  voucherRows: [
    {
      expenseHead: String,
      costCenter: String,
      ref: String,
      amountFC: String,
      convRate: String,
      amountBDT: String,
      narration: String,
      cheqRTGS: String,
      paidTo: String,
      status: { type: Boolean, default: false },
    },
  ],
}, { timestamps: true });

const modelCache = {};

export function getRecivedVoucher(year) {
  const modelName = `Recived_Voucher_${year}`;
  if (!modelCache[modelName]) {
    modelCache[modelName] = mongoose.models[modelName] || mongoose.model(modelName, recivedVoucherSchema, `recived_vouchers_${year}`);
  }
  return modelCache[modelName];
}
