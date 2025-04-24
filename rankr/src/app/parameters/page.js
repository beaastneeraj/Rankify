'use client';
import { useState, useEffect } from 'react';

const DEFAULT_WEIGHTS = {
  tlr: 30,
  rpp: 30,
  go: 20,
  oi: 10,
  perc: 10
};

const PARAM_LIMITS = {
  tlr: { min: 10, max: 60 },
  rpp: { min: 5, max: 50 },
  go: { min: 5, max: 50 },
  oi: { min: 5, max: 20 },
  perc: { min: 5, max: 20 },
};

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

export default function ParametersPage() {
  const [year, setYear] = useState('2024');
  const [category, setCategory] = useState('overall');
  const [state, setState] = useState('All');
  const [region, setRegion] = useState('All');
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [weights, setWeights] = useState({
    ...DEFAULT_WEIGHTS
  });

  // Function to adjust weights to total 100
  const adjustWeights = (newWeights) => {
    const total = Object.values(newWeights).reduce((sum, weight) => sum + weight, 0);
    if (total === 0) return newWeights;
    
    return Object.keys(newWeights).reduce((adjusted, key) => {
      adjusted[key] = Math.round((newWeights[key] / total) * 100);
      return adjusted;
    }, {});
  };

  // Handle weight change
  const handleWeightChange = (parameter, value) => {
    // Enforce min/max strictly
    const { min, max } = PARAM_LIMITS[parameter];
    let newValue = parseInt(value) || min;
    newValue = Math.max(min, Math.min(max, newValue));
    const newWeights = { ...weights, [parameter]: newValue };

    // Adjust other weights proportionally to maintain total of 100
    const total = Object.values(newWeights).reduce((sum, w) => sum + w, 0);
    if (total !== 100) {
      const remainder = 100 - newValue;
      const otherParams = Object.keys(weights).filter(key => key !== parameter);
      const totalOthers = otherParams.reduce((sum, key) => sum + newWeights[key], 0);
      if (totalOthers > 0) {
        otherParams.forEach(key => {
          // Clamp each to its min/max after proportional adjustment
          let val = Math.round((newWeights[key] / totalOthers) * remainder);
          val = Math.max(PARAM_LIMITS[key].min, Math.min(PARAM_LIMITS[key].max, val));
          newWeights[key] = val;
        });
      } else {
        const equalShare = Math.floor(remainder / otherParams.length);
        otherParams.forEach(key => {
          newWeights[key] = Math.max(PARAM_LIMITS[key].min, Math.min(PARAM_LIMITS[key].max, equalShare));
        });
        // Add any remaining points to the last parameter
        const actualTotal = Object.values(newWeights).reduce((sum, w) => sum + w, 0);
        if (actualTotal < 100) {
          const last = otherParams[otherParams.length - 1];
          newWeights[last] = Math.max(PARAM_LIMITS[last].min, Math.min(PARAM_LIMITS[last].max, newWeights[last] + (100 - actualTotal)));
        }
      }
    }
    setWeights(newWeights);
  };

  // Add setDefaultWeights function
  const setDefaultWeights = () => {
    setWeights({ ...DEFAULT_WEIGHTS });
    // Fetch rankings with default weights
    setTimeout(() => {
      fetchRankings();
    }, 0);
  };

  // Fetch initial rankings
  useEffect(() => {
    fetchRankings();
  }, [year, category, state, region]);

  const fetchRankings = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ 
        year, 
        category, 
        state,
        region,
        ...weights 
      });
      const response = await fetch(`/api/ranking?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setRankings(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch rankings');
      console.error(err);
    }
    setLoading(false);
  };

  const updateParameters = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/updateParams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...weights,
          year,
          category,
          state,
          region
        }),
      });

      const data = await response.json();
      if (data.success) {
        // Update rankings directly from the response instead of fetching again
        setRankings(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to update parameters');
      console.error(err);
    }
    setLoading(false);
  };

  // In the filteredStates logic, if region is not 'All', state is optional and defaults to 'All'.
  const filteredStates = region === 'All'
    ? [
        'All',
        ...Object.values(REGIONS).flat()
      ]
    : ['All', ...REGIONS[region]];

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8 bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <div className="w-full">
          <h1 className="text-5xl font-extrabold mb-10 text-center text-blue-700 drop-shadow-lg tracking-tight">Ranking Parameters</h1>
          <div className="mb-8 flex gap-4 justify-center">
            <select
              value={region}
              onChange={e => setRegion(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="All">All Regions</option>
              {Object.keys(REGIONS).map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="p-2 border rounded"
            >
              {filteredStates.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {region !== 'All' && (
              <span className="text-xs text-gray-500 ml-2">(State is optional when region is selected)</span>
            )}
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="overall">Overall</option>
              <option value="engineering">Engineering</option>
              <option value="university">University</option>
              <option value="college">College</option>
            </select>
          </div>

          <div className="mb-8 p-8 rounded-3xl shadow-2xl bg-white/80 backdrop-blur-lg border border-blue-100">
            <h2 className="text-2xl font-bold mb-4 text-blue-700">Parameter Weights <span className='text-base text-gray-500'>(Total: {Object.values(weights).reduce((a, b) => a + b, 0)}%)</span></h2>
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <label className="block font-semibold text-gray-700 w-64">TLR (Teaching, Learning & Resources) <span className='text-xs'>(10-60)</span></label>
                <input
                  type="range"
                  min={PARAM_LIMITS.tlr.min}
                  max={PARAM_LIMITS.tlr.max}
                  value={weights.tlr}
                  onChange={(e) => handleWeightChange('tlr', e.target.value)}
                  className="w-full accent-blue-500 h-2 rounded-lg appearance-none cursor-pointer bg-blue-100"
                />
                <span className="ml-2 font-bold text-blue-700">{weights.tlr}%</span>
              </div>
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <label className="block font-semibold text-gray-700 w-64">RP (Research & Professional Practice) <span className='text-xs'>(5-50)</span></label>
                <input
                  type="range"
                  min={PARAM_LIMITS.rpp.min}
                  max={PARAM_LIMITS.rpp.max}
                  value={weights.rpp}
                  onChange={(e) => handleWeightChange('rpp', e.target.value)}
                  className="w-full accent-blue-500 h-2 rounded-lg appearance-none cursor-pointer bg-blue-100"
                />
                <span className="ml-2 font-bold text-blue-700">{weights.rpp}%</span>
              </div>
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <label className="block font-semibold text-gray-700 w-64">GO (Graduation Outcome) <span className='text-xs'>(5-50)</span></label>
                <input
                  type="range"
                  min={PARAM_LIMITS.go.min}
                  max={PARAM_LIMITS.go.max}
                  value={weights.go}
                  onChange={(e) => handleWeightChange('go', e.target.value)}
                  className="w-full accent-blue-500 h-2 rounded-lg appearance-none cursor-pointer bg-blue-100"
                />
                <span className="ml-2 font-bold text-blue-700">{weights.go}%</span>
              </div>
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <label className="block font-semibold text-gray-700 w-64">OI (Outreach & Inclusivity) <span className='text-xs'>(5-20)</span></label>
                <input
                  type="range"
                  min={PARAM_LIMITS.oi.min}
                  max={PARAM_LIMITS.oi.max}
                  value={weights.oi}
                  onChange={(e) => handleWeightChange('oi', e.target.value)}
                  className="w-full accent-blue-500 h-2 rounded-lg appearance-none cursor-pointer bg-blue-100"
                />
                <span className="ml-2 font-bold text-blue-700">{weights.oi}%</span>
              </div>
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <label className="block font-semibold text-gray-700 w-64">PR (Peer Perception) <span className='text-xs'>(5-20)</span></label>
                <input
                  type="range"
                  min={PARAM_LIMITS.perc.min}
                  max={PARAM_LIMITS.perc.max}
                  value={weights.perc}
                  onChange={(e) => handleWeightChange('perc', e.target.value)}
                  className="w-full accent-blue-500 h-2 rounded-lg appearance-none cursor-pointer bg-blue-100"
                />
                <span className="ml-2 font-bold text-blue-700">{weights.perc}%</span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mt-8 justify-center">
              <button
                onClick={updateParameters}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-400 text-white font-bold rounded-2xl shadow-lg hover:from-blue-700 hover:to-blue-500 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed text-lg"
              >
                {loading ? 'Updating...' : 'Update Rankings'}
              </button>
              <button
                onClick={setDefaultWeights}
                type="button"
                className="px-6 py-3 bg-gradient-to-r from-gray-200 to-gray-100 text-blue-700 font-bold rounded-2xl shadow hover:from-blue-100 hover:to-white border border-blue-200 transition-all duration-200 text-lg"
              >
                Set Default
              </button>
            </div>
          </div>

          {error && (
            <div className="text-red-500 mb-4 text-center font-semibold bg-red-50 border border-red-200 rounded-xl p-4 shadow">
              {error}
            </div>
          )}

          {rankings.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-blue-700">Updated Rankings</h2>
              <div className="overflow-x-auto rounded-2xl shadow-xl bg-white/90 backdrop-blur border border-blue-100">
                <table className="min-w-full bg-transparent">
                  <thead className="bg-blue-50">
                    <tr>
                      <th className="px-4 py-2">New Rank</th>
                      <th className="px-4 py-2">Original Rank</th>
                      <th className="px-4 py-2">Institution</th>
                      <th className="px-4 py-2">City</th>
                      <th className="px-4 py-2">State</th>
                      <th className="px-4 py-2">New Score</th>
                      <th className="px-4 py-2">Original Score</th>
                      <th className="px-4 py-2">Report</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rankings.map((inst, index) => (
                      <tr key={inst._id} className={index % 2 === 0 ? 'bg-blue-50/40' : 'bg-white/60'}>
                        <td className="px-4 py-2 font-bold text-blue-700">{inst.calculatedRank}</td>
                        <td className="px-4 py-2">{inst.rank}</td>
                        <td className="px-4 py-2 font-semibold">{inst.institution}</td>
                        <td className="px-4 py-2">{inst.city}</td>
                        <td className="px-4 py-2">{inst.state}</td>
                        <td className="px-4 py-2 font-bold text-green-700">{typeof inst.calculatedScore === 'number' ? inst.calculatedScore.toFixed(2) : inst.score?.toFixed(2) || '0.00'}</td>
                        <td className="px-4 py-2">{typeof inst.score === 'number' ? inst.score.toFixed(2) : '0.00'}</td>
                        <td className="px-4 py-2">
                          <a
                            href={`/reports/${inst._id}.pdf`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline hover:text-blue-800"
                          >
                            View Report
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
