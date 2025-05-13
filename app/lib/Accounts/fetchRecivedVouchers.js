import { connectToDB } from "../connectToDB";
import { getRecivedVoucher } from "./recivedModal";

export const getRecivedVouchersFromAllYears = async () => {
  await connectToDB();

  const currentDate = new Date();
  const todayStart = new Date(currentDate.setHours(0, 0, 0, 0));
  const todayEnd = new Date(currentDate.setHours(23, 59, 59, 999));

  const startYear = 2024; // adjust as needed
  const endYear = new Date().getFullYear() + 1;

  const allResults = [];

  for (let year = startYear; year <= endYear; year++) {
    const Model = getRecivedVoucher(year);

    try {
      const vouchers = await Model.find({
        createdAt: { $gte: todayStart, $lte: todayEnd },
      });

      if (vouchers.length > 0) {
        allResults.push(...vouchers);
      }
    } catch (error) {
      console.warn(`⚠️ Error fetching from vouchers_${year}:`, error.message);
    }
  }

  return allResults;
};
