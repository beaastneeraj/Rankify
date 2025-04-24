import mongoose from 'mongoose';

const rankingSchema = new mongoose.Schema({
  name: String,
  institution: String,
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  rank: {
    type: Number,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true,
    lowercase: true
  },
  TLR: {
    type: Number,
    default: 0
  },
  RP: {
    type: Number,
    default: 0
  },
  GO: {
    type: Number,
    default: 0
  },
  OI: {
    type: Number,
    default: 0
  },
  PR: {
    type: Number,
    default: 0
  },
  // Optional fields from CSV
  TLR_SS: Number,
  TLR_FSR: Number,
  TLR_FQE: Number,
  TLR_FRU: Number,
  RP_PU: Number,
  RP_QP: Number,
  RP_IPR: Number,
  RP_FPPP: Number,
  GO_GPH: Number,
  GO_GUE: Number,
  GO_MS: Number,
  GO_GPHD: Number,
  OI_RD: Number,
  OI_WD: Number,
  OI_ESCS: Number,
  OI_PCS: Number
});

// Pre-save middleware to ensure either name or institution is set
rankingSchema.pre('save', function(next) {
  if (!this.name && !this.institution) {
    next(new Error('Either name or institution must be provided'));
  }
  if (!this.institution) {
    this.institution = this.name;
  }
  if (!this.name) {
    this.name = this.institution;
  }
  next();
});

const Ranking = mongoose.models?.Ranking || mongoose.model('Ranking', rankingSchema);

export default Ranking;
