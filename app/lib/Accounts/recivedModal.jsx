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
  paidFromBank: String,
  cashCurrentBalance: String,
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
