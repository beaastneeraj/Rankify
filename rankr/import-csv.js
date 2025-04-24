import fs from 'fs';
import csv from 'csv-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Ranking from './src/models/Ranking.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rankr';

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

async function importCSV(filePath) {
  const results = [];
  const category = filePath.toLowerCase().includes('eng') ? 'engineering' 
                  : filePath.toLowerCase().includes('overall') ? 'overall'
                  : filePath.toLowerCase().includes('university') ? 'university'
                  : filePath.toLowerCase().includes('college') ? 'college'
                  : null;
                  
  const year = filePath.includes('2024') ? 2024
             : filePath.includes('2023') ? 2023
             : filePath.includes('2022') ? 2022
             : null;

  if (!category || !year) {
    console.error(`Could not determine category or year from filename: ${filePath}`);
    return [];
  }

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        // Skip header or empty rows
        if (!data.name && !data.institution) return;

        // Map CSV columns to model fields
        const ranking = {
          name: data.name || data.institution,
          institution: data.name || data.institution,
          city: data.city,
          state: data.state,
          rank: parseInt(data.rank) || 0,
          score: parseFloat(data.score) || 0,
          year: year,
          category: category,
          // Main parameters
          TLR: calculateTLR(data),
          RP: calculateRP(data),
          GO: calculateGO(data),
          OI: calculateOI(data),
          PR: parseFloat(data['PR Score (Max 100.00)']) || 0,
          // Detailed scores
          TLR_SS: parseFloat(data['TLR_SS Score (Max 20.00)']),
          TLR_FSR: parseFloat(data['TLR_FSR Score (Max 30.00)']),
          TLR_FQE: parseFloat(data['TLR_FQE Score (Max 20.00)']),
          TLR_FRU: parseFloat(data['TLR_FRU Score (Max 30.00)']),
          RP_PU: parseFloat(data['RP_PU Score (Max 35.00)']),
          RP_QP: parseFloat(data['RP_QP Score (Max 40.00)']),
          RP_IPR: parseFloat(data['RP_IPR Score (Max 15.00)']),
          RP_FPPP: parseFloat(data['RP_FPPP Score (Max 10.00)']),
          GO_GPH: parseFloat(data['GO_GPH Score (Max 40.00)']),
          GO_GUE: parseFloat(data['GO_GUE Score (Max 15.00)']),
          GO_MS: parseFloat(data['GO_MS Score (Max 25.00)']),
          GO_GPHD: parseFloat(data['GO_GPHD Score (Max 20.00)']),
          OI_RD: parseFloat(data['OI_RD Score (Max 30.00)']),
          OI_WD: parseFloat(data['OI_WD Score (Max 30.00)']),
          OI_ESCS: parseFloat(data['OI_ESCS Score (Max 20.00)']),
          OI_PCS: parseFloat(data['OI_PCS Score (Max 20.00)'])
        };

        // Remove any NaN values
        Object.keys(ranking).forEach(key => {
          if (typeof ranking[key] === 'number' && isNaN(ranking[key])) {
            ranking[key] = 0;
          }
        });

        results.push(ranking);
      })
      .on('end', () => {
        console.log(`[${filePath}] Parsed ${results.length} valid entries`);
        console.log('Sample entry:', results[0]);
        resolve(results);
      })
      .on('error', reject);
  });
}

function calculateTLR(data) {
  return (
    (parseFloat(data['TLR_SS Score (Max 20.00)']) || 0) +
    (parseFloat(data['TLR_FSR Score (Max 30.00)']) || 0) +
    (parseFloat(data['TLR_FQE Score (Max 20.00)']) || 0) +
    (parseFloat(data['TLR_FRU Score (Max 30.00)']) || 0)
  );
}

function calculateRP(data) {
  return (
    (parseFloat(data['RP_PU Score (Max 35.00)']) || 0) +
    (parseFloat(data['RP_QP Score (Max 40.00)']) || 0) +
    (parseFloat(data['RP_IPR Score (Max 15.00)']) || 0) +
    (parseFloat(data['RP_FPPP Score (Max 10.00)']) || 0)
  );
}

function calculateGO(data) {
  return (
    (parseFloat(data['GO_GPH Score (Max 40.00)']) || 0) +
    (parseFloat(data['GO_GUE Score (Max 15.00)']) || 0) +
    (parseFloat(data['GO_MS Score (Max 25.00)']) || 0) +
    (parseFloat(data['GO_GPHD Score (Max 20.00)']) || 0)
  );
}

function calculateOI(data) {
  return (
    (parseFloat(data['OI_RD Score (Max 30.00)']) || 0) +
    (parseFloat(data['OI_WD Score (Max 30.00)']) || 0) +
    (parseFloat(data['OI_ESCS Score (Max 20.00)']) || 0) +
    (parseFloat(data['OI_PCS Score (Max 20.00)']) || 0)
  );
}

async function main() {
  await connectDB();

  // Clear existing data
  await Ranking.deleteMany({});
  console.log('Cleared existing rankings');

  const csvFiles = [
    './College_full_img_2024_data.csv',
    './eng_2022.csv',
    './eng_2023.csv',
    './eng_2024.csv',
    './overall_2024.csv',
    './Overall_full_img_2022_data.csv',
    './Overall_full_img_2023_data.csv',
    './University_full_img_2024_data.csv'
  ];

  let totalImported = 0;
  for (const file of csvFiles) {
    const rankings = await importCSV(file);
    if (rankings.length > 0) {
      await Ranking.insertMany(rankings);
      totalImported += rankings.length;
    }
  }

  console.log('Import complete. Total entries imported:', totalImported);
  
  // Print statistics
  const stats = await Ranking.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 }
      }
    }
  ]);
  
  console.log('Entries by category:', stats);

  mongoose.connection.close();
}

main().catch(console.error);