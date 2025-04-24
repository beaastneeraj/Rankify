import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Ranking from '@/models/Ranking';

export async function GET(req) {
  console.log('Fetching rankings...');
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const year = Number(searchParams.get('year'));
    const category = searchParams.get('category');
    const state = searchParams.get('state');
    const tlr = Number(searchParams.get('tlr')) || null;
    const rpp = Number(searchParams.get('rpp')) || null;
    const go = Number(searchParams.get('go')) || null;
    const oi = Number(searchParams.get('oi')) || null;
    const perc = Number(searchParams.get('perc')) || null;

    if (!year || !category) {
      return NextResponse.json({ message: 'Missing required fields', data: null }, { status: 400 });
    }

    // Build query for fetching rankings
    const query = { year, category };
    if (state && state !== 'All') {
      query.state = state;
    }

    // Fetch rankings from the database
    let rankings = await Ranking.find(query).sort({ rank: 1 });

    if (!rankings.length) {
      return NextResponse.json({ message: 'No rankings found', data: null }, { status: 404 });
    }

    // If parameter weights are provided, recalculate scores
    if (tlr !== null && rpp !== null && go !== null && oi !== null && perc !== null) {
      rankings = rankings.map((inst) => {
        const params = {
          TLR: Number(inst.TLR) || 0,
          RP: Number(inst.RP) || 0,
          GO: Number(inst.GO) || 0,
          OI: Number(inst.OI) || 0,
          PR: Number(inst.PR) || 0,
        };

        const newScore = (
          (params.TLR * tlr +
          params.RP * rpp +
          params.GO * go +
          params.OI * oi +
          params.PR * perc)
        ) / 100;

        return {
          ...inst.toObject(),
          score: Number.isFinite(newScore) ? newScore : inst.score,
        };
      });

      // Sort rankings by the new score
      rankings.sort((a, b) => b.score - a.score);

      // Update ranks based on the new scores
      rankings = rankings.map((inst, index) => ({ ...inst, rank: index + 1 }));
    }

    return NextResponse.json({ message: 'Rankings fetched successfully', data: rankings });
  } catch (err) {
    console.error('Error fetching rankings:', err);
    return NextResponse.json({ message: 'Internal Server Error', data: null }, { status: 500 });
  }
}