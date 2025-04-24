const mongoose = require('mongoose');

const RankingSchema = new mongoose.Schema({
  name: String, // College/University/Institute name
  score: Number, // Score from CSV
  rank: Number, // Rank from CSV
  year: Number, // Year of ranking
  category: String, // Category (Engineering, Overall, etc.)
  // Add more fields as per your CSV structure
}, { timestamps: true });

module.exports = mongoose.models.Ranking || mongoose.model('Ranking', RankingSchema);