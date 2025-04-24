const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const Ranking = require('./src/models/Ranking');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rankr';

// Get all CSV files from both root and rankr folders
const rootDir = __dirname;
const rankrDir = path.join(__dirname, 'rankr');
const csvFiles = [
  ...fs.readdirSync(rootDir).filter(f => f.endsWith('.csv')).map(f => path.join(rootDir, f)),
  ...fs.readdirSync(rankrDir).filter(f => f.endsWith('.csv')).map(f => path.join(rankrDir, f))
];

function getCategoryFromFile(file) {
  const lower = file.toLowerCase();
  if (lower.includes('eng')) return 'engineering';
  if (lower.includes('overall')) return 'overall';
  if (lower.includes('college')) return 'college';
  if (lower.includes('university')) return 'university';
  return 'other';
}

function calculateParameterScore(data, parameterColumns) {
  return Object.entries(parameterColumns).reduce((total, [key, columns]) => {
    const score = columns.reduce((sum, col) => {
      const value = parseFloat(data[col]) || 0;
      return sum + value;
    }, 0);
    return { ...total, [key]: score };
  }, {});
}

function parseRow(data, file) {
  // Define parameter columns based on file type
  const isEngineering = file.toLowerCase().includes('eng');
  
  const parameterColumns = {
    TLR: isEngineering 
      ? ['TLR_SS Score (Max 20.00)', 'TLR_FSR Score (Max 30.00)', 'TLR_FQE Score (Max 20.00)', 'TLR_FRU Score (Max 30.00)']
      : ['TLR_SS Score (Max 20.00)', 'TLR_FSR Score (Max 25.00)', 'TLR_FQE Score (Max 20.00)', 'TLR_FRU Score (Max 20.00)'],
    RP: isEngineering
      ? ['RP_PU Score (Max 35.00)', 'RP_QP Score (Max 40.00)', 'RP_IPR Score (Max 15.00)', 'RP_FPPP Score (Max 10.00)']
      : ['RP_PU Score (Max 15.00)', 'RP_QP Score (Max 30.00)', 'RP_IPR Score (Max 30.00)', 'RP_FPPP Score (Max 15.00)'],
    GO: isEngineering
      ? ['GO_GPH Score (Max 40.00)', 'GO_GUE Score (Max 15.00)', 'GO_MS Score (Max 25.00)', 'GO_GPHD Score (Max 20.00)']
      : ['GO_GPH Score (Max 15.00)', 'GO_GUE Score (Max 10.00)', 'GO_MS Score (Max 60.00)', 'GO_GPHD Score (Max 40.00)'],
    OI: ['OI_RD Score (Max 30.00)', 'OI_WD Score (Max 30.00)', 'OI_ESCS Score (Max 20.00)', 'OI_PCS Score (Max 20.00)'],
    PR: ['PR Score (Max 100.00)']
  };

  // Calculate parameter scores
  const scores = calculateParameterScore(data, parameterColumns);
  
  // Use default weights for initial score
  const defaultWeights = {
    tlr: 20,
    rp: 20,
    go: 20,
    oi: 20,
    pr: 20
  };

  // Calculate initial weighted score
  const score = (
    (scores.TLR * defaultWeights.tlr) +
    (scores.RP * defaultWeights.rp) +
    (scores.GO * defaultWeights.go) +
    (scores.OI * defaultWeights.oi) +
    (scores.PR * defaultWeights.pr)
  ) / 100;

  return {
    institution: data.name || data.institution || data.college || data["Institution"] || data["University"] || '',
    city: data.city || data.City || '',
    state: data.state || data.State || '',
    rank: Number(data.rank || data.Rank || '0'),
    score: score,
    year: Number(file.match(/\d{4}/)?.[0] || '2024'),
    category: getCategoryFromFile(file),
    report: data.report || data.Report || '',
    // Store raw parameter scores for recalculation
    TLR: scores.TLR,
    RP: scores.RP,
    GO: scores.GO,
    OI: scores.OI,
    PR: scores.PR
  };
}

async function importCSV(file) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(file)
      .pipe(csv())
      .on('data', (data) => {
        const parsed = parseRow(data, file);
        if (parsed.institution && parsed.score > 0) {
          results.push(parsed);
        }
      })
      .on('end', async () => {
        try {
          console.log(`[${file}] Parsed ${results.length} valid entries`);
          if (results.length > 0) {
            console.log(`Sample entry:`, results[0]);
          }
          await Ranking.insertMany(results, { ordered: false });
          resolve(results.length);
        } catch (err) {
          reject(err);
        }
      });
  });
}

async function main() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing rankings...');
    await Ranking.deleteMany({});
    
    // Import all CSV files
    console.log('Starting CSV imports...');
    let totalImported = 0;
    
    for (const file of csvFiles) {
      try {
        const count = await importCSV(file);
        totalImported += count;
        console.log(`Successfully imported ${count} entries from ${path.basename(file)}`);
      } catch (err) {
        console.error(`Error importing ${file}:`, err.message);
      }
    }
    
    console.log(`Import complete. Total entries imported: ${totalImported}`);
    
    // Verify data
    const counts = await Ranking.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);
    console.log('Entries by category:', counts);
    
  } catch (err) {
    console.error('Import failed:', err);
  } finally {
    await mongoose.disconnect();
  }
}

main();
