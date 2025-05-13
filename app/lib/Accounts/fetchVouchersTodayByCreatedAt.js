import { connectToDB } from "../connectToDB";
import { getVoucherModelByYear } from "./voucherModel";
import mongoose from "mongoose";

/**
 * Gets all today's created vouchers from all existing year collections in the database
 * @returns {Promise<Array>} Array of vouchers created today from all year collections
 */
export const getTodayCreatedVouchersFromAllYears = async () => {
  const db = await connectToDB();
  
  const currentDate = new Date();
  const todayStart = new Date(currentDate);
  todayStart.setHours(0, 0, 0, 0);
  
  const todayEnd = new Date(currentDate);
  todayEnd.setHours(23, 59, 59, 999);

  console.log(`Fetching vouchers created today between ${todayStart.toISOString()} and ${todayEnd.toISOString()}`);

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

  console.log(`Found ${voucherCollections.length} voucher collections: ${voucherCollections.join(', ')}`);

  const allResults = [];
  const batchSize = 5; // Process 5 collections at a time to avoid too many concurrent operations

  // Process collections in batches
  for (let i = 0; i < voucherCollections.length; i += batchSize) {
    const yearBatch = voucherCollections.slice(i, i + batchSize);
    console.log(`Processing batch of years: ${yearBatch.join(', ')}`);
    
    // Process each year in the current batch in parallel
    const batchResults = await Promise.all(
      yearBatch.map(async (year) => {
        try {
          const Model = getVoucherModelByYear(year);
          const vouchers = await Model.find({
            createdAt: { $gte: todayStart, $lte: todayEnd },
          });
          
          console.log(`Found ${vouchers.length} vouchers from year ${year}`);
          
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

  console.log(`Total vouchers found across all years: ${allResults.length}`);
  return allResults;
};

/**
 * Alternative implementation that gets all voucher collections and processes them in chunks
 * Used when mongoose.connection.db.listCollections() is not available
 */
export const getAllVouchersAlternative = async () => {
  await connectToDB();
  
  const currentDate = new Date();
  const todayStart = new Date(currentDate);
  todayStart.setHours(0, 0, 0, 0);
  
  const todayEnd = new Date(currentDate);
  todayEnd.setHours(23, 59, 59, 999);

  // Try to find all existing voucher collections by checking year by year
  // We'll set reasonable limits to avoid checking thousands of years
  const minYear = 2000; // Adjust as needed based on your business requirements
  const maxYear = new Date().getFullYear() + 5; // Check up to 5 years in the future
  
  const existingYears = [];
  const batchSize = 10;
  
  // First, check which years have collections by trying to access them
  for (let year = minYear; year <= maxYear; year += batchSize) {
    const yearBatch = Array.from({ length: batchSize }, (_, i) => year + i).filter(y => y <= maxYear);
    
    await Promise.all(
      yearBatch.map(async (y) => {
        try {
          const collectionName = `vouchers_${y}`;
          // Check if collection exists by getting its stats
          const stats = await mongoose.connection.db.command({ collStats: collectionName });
          if (stats && stats.ns) {
            existingYears.push(y);
          }
        } catch (error) {
          // Collection doesn't exist, which is fine
        }
      })
    );
  }
  
  console.log(`Found voucher collections for years: ${existingYears.join(', ')}`);
  
  // Now process the existing years to get vouchers
  const allResults = [];
  
  for (let i = 0; i < existingYears.length; i += batchSize) {
    const yearBatch = existingYears.slice(i, i + batchSize);
    
    const batchResults = await Promise.all(
      yearBatch.map(async (year) => {
        try {
          const Model = getVoucherModelByYear(year);
          const vouchers = await Model.find({
            createdAt: { $gte: todayStart, $lte: todayEnd },
          });
          
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
    
    batchResults.forEach(yearResults => {
      if (yearResults.length > 0) {
        allResults.push(...yearResults);
      }
    });
  }
  
  return allResults;
};