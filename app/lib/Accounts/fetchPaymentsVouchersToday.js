import { connectToDB } from "../connectToDB";
import { getVoucherModelByYear } from "./voucherModel";
import mongoose from "mongoose";

/**
 * Gets all today's created vouchers from all existing year collections in the database
 * @returns {Promise<Array>} Array of vouchers created today from all year collections
 */
export const getTodayCreatedPaymentVouchersFromAllYears = async () => {
  const db = await connectToDB();
  
  const currentDate = new Date();
  const todayStart = new Date(currentDate);
  todayStart.setHours(0, 0, 0, 0);
  
  const todayEnd = new Date(currentDate);
  todayEnd.setHours(23, 59, 59, 999);

  // console.log(`Fetching vouchers created today between ${todayStart.toISOString()} and ${todayEnd.toISOString()}`);

  // Get all collections from the database
  const collections = await mongoose.connection.db.listCollections().toArray();
  
  // Filter only voucher collections based on naming pattern (assuming they follow "vouchers_YYYY" pattern)
  const voucherCollections = collections
    .filter(collection => /^vouchers_\d{4}$/.test(collection.name))
    .map(collection => {
      // Extract year from collection name
      const yearMatch = collection.name.match(/^vouchers_(\d{4})$/);
      if (yearMatch && yearMatch[1]) {
        return parseInt(yearMatch[1], 10);
      }
      return null;
    })
    .filter(year => year !== null);

  // console.log(`Found ${voucherCollections.length} voucher collections: ${voucherCollections.join(', ')}`);

  const allResults = [];
  const batchSize = 5; // Process 5 collections at a time to avoid too many concurrent operations

  // Process collections in batches
  for (let i = 0; i < voucherCollections.length; i += batchSize) {
    const yearBatch = voucherCollections.slice(i, i + batchSize);
    // console.log(`Processing batch of years: ${yearBatch.join(', ')}`);
    
    // Process each year in the current batch in parallel
    const batchResults = await Promise.all(
      yearBatch.map(async (year) => {
        try {
          const Model = getVoucherModelByYear(year);
          const vouchers = await Model.find({
            createdAt: { $gte: todayStart, $lte: todayEnd },
          });
          
          // console.log(`Found ${vouchers.length} vouchers from year ${year}`);
          
          // Add year information to each voucher
          return vouchers.map(voucher => {
            const voucherObj = voucher.toObject ? voucher.toObject() : voucher;
            return { ...voucherObj, sourceYear: year };
          });
        } catch (error) {
          console.warn(`⚠️ Error fetching from vouchers_${year}:`, error.message);
          return [];
        }
      })
    );
    
    // Flatten results and add to main array
    batchResults.forEach(yearResults => {
      if (yearResults.length > 0) {
        allResults.push(...yearResults);
      }
    });
  }

  // console.log(`Total vouchers found across all years: ${allResults.length}`);
  return allResults;
};