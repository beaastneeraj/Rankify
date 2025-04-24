import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Ranking from '@/models/Ranking';

export async function POST(req) {
  try {
    await connectDB();
    
    const { year, category, state, tlr, rpp, go, oi, perc } = await req.json();

    // Validate required fields
    if (!year || !category || !tlr || !rpp || !go || !oi || !perc) {
      return NextResponse.json({
        success: false,
        message: 'All parameters are required'
      }, { status: 400 });
    }

    // Validate ranges
    if (tlr < 10 || tlr > 60) {
      return NextResponse.json({ success: false, message: 'TLR must be between 10 and 60' }, { status: 400 });
    }
    if (rpp < 5 || rpp > 50) {
      return NextResponse.json({ success: false, message: 'RPP must be between 5 and 50' }, { status: 400 });
    }
    if (go < 5 || go > 50) {
      return NextResponse.json({ success: false, message: 'GO must be between 5 and 50' }, { status: 400 });
    }
    if (oi < 5 || oi > 20) {
      return NextResponse.json({ success: false, message: 'OI must be between 5 and 20' }, { status: 400 });
    }
    if (perc < 5 || perc > 20) {
      return NextResponse.json({ success: false, message: 'PR must be between 5 and 20' }, { status: 400 });
    }

    // Validate total weight
    const totalWeight = tlr + rpp + go + oi + perc;
    if (totalWeight < 100 || totalWeight > 200) {
      return NextResponse.json({ 
        success: false, 
        message: 'Total weight must be between 100 and 200' 
      }, { status: 400 });
    }

    // Build query
    const query = { year: Number(year), category };
    if (state && state !== 'All') {
      query.state = state;
    }

    // Fetch all matching institutions
    const institutions = await Ranking.find(query);
    
    if (!institutions.length) {
      return NextResponse.json({
        success: false,
        message: 'No institutions found for the given criteria'
      }, { status: 404 });
    }

    // Calculate new scores for each institution
    const updatedInstitutions = institutions.map(inst => {
      // Ensure all parameters have numeric values
      const tlrScore = Number(inst.TLR) || 0;
      const rpScore = Number(inst.RP) || 0;
      const goScore = Number(inst.GO) || 0;
      const oiScore = Number(inst.OI) || 0;
      const prScore = Number(inst.PR) || 0;

      // Calculate new score using the provided weights
      const newScore = (
        (tlrScore * (tlr / totalWeight)) +
        (rpScore * (rpp / totalWeight)) +
        (goScore * (go / totalWeight)) +
        (oiScore * (oi / totalWeight)) +
        (prScore * (perc / totalWeight))
      ); // Removed *100 here

      // Ensure we always have a valid calculatedScore
      const calculatedScore = Number.isFinite(newScore) ? Number(newScore.toFixed(2)) : Number(inst.score) || 0;

      return {
        _id: inst._id,
        name: inst.name || inst.institution,
        institution: inst.name || inst.institution,
        city: inst.city || '',
        state: inst.state || '',
        score: Number(inst.score) || 0,
        rank: Number(inst.rank) || 0,
        calculatedScore
      };
    });

    // Sort by new calculated scores
    updatedInstitutions.sort((a, b) => b.calculatedScore - a.calculatedScore);

    // Assign new ranks
    const rankedInstitutions = updatedInstitutions.map((inst, index) => ({
      ...inst,
      calculatedRank: index + 1
    }));

    return NextResponse.json({
      success: true,
      message: 'Parameters applied successfully',
      data: rankedInstitutions
    });

  } catch (error) {
    console.error('Error updating parameters:', error);
    return NextResponse.json({
      success: false, 
      message: error.message || 'Failed to update parameters'
    }, { status: 500 });
  }
}
