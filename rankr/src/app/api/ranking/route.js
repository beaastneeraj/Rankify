import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Ranking from '@/models/Ranking';

export async function GET(req) {
  console.log('Ranking API called');
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const year = Number(searchParams.get('year'));
    const category = searchParams.get('category')?.toLowerCase();
    const state = searchParams.get('state');
    const region = searchParams.get('region'); // <-- Add region param
    const tlr = Number(searchParams.get('tlr')) || null;
    const rpp = Number(searchParams.get('rpp')) || null;
    const go = Number(searchParams.get('go')) || null;
    const oi = Number(searchParams.get('oi')) || null;
    const perc = Number(searchParams.get('perc')) || null;

    // Region to states mapping (same as frontend)
    const REGIONS = {
      North: [
        'Delhi', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Punjab', 'Uttarakhand', 'Uttar Pradesh', 'Chandigarh', 'Ladakh'
      ],
      South: [
        'Andhra Pradesh', 'Karnataka', 'Kerala', 'Tamil Nadu', 'Telangana', 'Puducherry', 'Lakshadweep'
      ],
      East: [
        'Bihar', 'Jharkhand', 'Odisha', 'West Bengal', 'Andaman and Nicobar Islands'
      ],
      West: [
        'Goa', 'Gujarat', 'Maharashtra', 'Rajasthan', 'Dadra and Nagar Haveli', 'Daman and Diu'
      ],
      Central: [
        'Chhattisgarh', 'Madhya Pradesh'
      ],
      Northeast: [
        'Arunachal Pradesh', 'Assam', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Sikkim', 'Tripura'
      ]
    };

    console.log('Query params:', { year, category, state, region });

    if (!year || !category) {
      return NextResponse.json({
        success: false,
        message: 'Year and category are required',
        data: null
      });
    }

    // Build query
    const query = {};
    
    // Add year condition
    query.year = year;
    
    // Add category condition - handle both formats (engineering/eng)
    if (category === 'engineering' || category === 'eng') {
      query.category = { $in: ['engineering', 'eng'] };
    } else {
      query.category = category;
    }
    
    // Region filter logic
    if (region && region !== 'All' && REGIONS[region]) {
      query.state = { $in: REGIONS[region] };
    } else if (state && state !== 'All') {
      query.state = state;
    }

    console.log('MongoDB query:', query);

    // Fetch rankings
    const rankings = await Ranking.find(query).sort({ rank: 1 });
    
    console.log(`Found ${rankings.length} rankings`);

    if (!rankings || rankings.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No rankings found for the specified criteria',
        data: null
      });
    }

    // If parameter weights are provided, recalculate scores
    if (tlr !== null && rpp !== null && go !== null && oi !== null && perc !== null) {
      const totalWeight = tlr + rpp + go + oi + perc;
      
      const updatedRankings = rankings.map(ranking => {
        const params = {
          TLR: Number(ranking.TLR) || 0,
          RP: Number(ranking.RP) || 0,
          GO: Number(ranking.GO) || 0,
          OI: Number(ranking.OI) || 0,
          PR: Number(ranking.PR) || 0,
        };

        const newScore = (
          (params.TLR * (tlr / totalWeight)) +
          (params.RP * (rpp / totalWeight)) +
          (params.GO * (go / totalWeight)) +
          (params.OI * (oi / totalWeight)) +
          (params.PR * (perc / totalWeight))
        ); // Removed *100 here

        return {
          ...ranking.toObject(),
          calculatedScore: Number.isFinite(newScore) ? Number(newScore.toFixed(2)) : ranking.score
        };
      });

      // Sort rankings by the new score
      updatedRankings.sort((a, b) => b.calculatedScore - a.calculatedScore);

      // Update ranks based on the new scores
      const finalRankings = updatedRankings.map((inst, index) => ({
        ...inst,
        calculatedRank: index + 1
      }));

      return NextResponse.json({
        success: true,
        message: 'Rankings retrieved successfully',
        data: finalRankings
      });
    }

    // Map the rankings to ensure consistent field names
    const mappedRankings = rankings.map(ranking => ({
      id: ranking._id.toString(),
      institution: ranking.name || ranking.institution,
      city: ranking.city,
      state: ranking.state,
      rank: ranking.rank,
      score: ranking.score,
      TLR: ranking.TLR || 0,
      RP: ranking.RP || 0,
      GO: ranking.GO || 0,
      OI: ranking.OI || 0,
      PR: ranking.PR || 0,
      year: ranking.year,
      category: ranking.category
    }));

    return NextResponse.json({
      success: true,
      message: 'Rankings retrieved successfully',
      data: mappedRankings
    });

  } catch (error) {
    console.error('Error in ranking API:', error);
    return NextResponse.json({
      success: false,
      message: error.message,
      data: null
    });
  }
}

export async function POST(request) {
  const { year, category, institution, rank, score, state, report } = await request.json();
  console.log({
    year,
    category,
    institution,
    rank,
    score,
    state,
    report
  }); // Debugging line
  
  if (!year || !category || !institution || !rank || !score || !state || !report) {
    return new Response(
      JSON.stringify({ success: false, message: 'All fields are required' }),
      { status: 400 }
    );
  }

  // Connect to MongoDB
  await connectToDatabase();

  try {
    // Create a new ranking entry
    const newRanking = new Ranking({
      year,
      category,
      institution,
      rank,
      score,
      state,
      report
    });

    await newRanking.save();

    return new Response(JSON.stringify({ success: true, data: newRanking }), {
      status: 201,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500 }
    );
  }
}
