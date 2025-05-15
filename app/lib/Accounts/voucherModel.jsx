import mongoose from 'mongoose';

const voucherSchema = new mongoose.Schema({
  group: String,
  company: String,
  project: String,
  transitionType: String,
  accountingPeriod: String,
  currency: String,
  lastVoucher: String,
  date: Date,
  paidFrom: String,
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
      status: { type: Boolean, default: false }
    },
  ],
}, { timestamps: true });

const modelCache = {};

export function getVoucherModelByYear(year) {
  const modelName = `Voucher_${year}`;
  if (!modelCache[modelName]) {
    modelCache[modelName] = mongoose.models[modelName] || mongoose.model(modelName, voucherSchema, `vouchers_${year}`);
  }
  return modelCache[modelName];
}
