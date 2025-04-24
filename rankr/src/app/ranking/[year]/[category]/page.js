'use client';
import { useEffect, useState, use } from 'react';
import Link from 'next/link';

// Place all institute PDF reports in the public/reports/ folder, named as {instituteId}.pdf (e.g., public/reports/12345.pdf)

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

export default function RankingPage({ params }) {
  const { year, category } = use(params); // Get year and category from route parameters
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [region, setRegion] = useState('All');
  const [state, setState] = useState('All');

  const filteredStates = region === 'All'
    ? [
        'All',
        ...Object.values(REGIONS).flat()
      ]
    : ['All', ...REGIONS[region]];

  useEffect(() => {
    // Fetch rankings for the specific year and category
    const fetchRankings = async () => {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        year,
        category,
        region,
        state
      });
      const res = await fetch(`/api/ranking?${params}`);
      const data = await res.json();

      if (data.success) {
        setRankings(data.data);
      } else {
        console.error('Error fetching rankings:', data.message);
        setError(data.message);
      }
      setLoading(false);
    };

    fetchRankings();
  }, [year, category, region, state]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-8 animate-fadein">
      {/* Breadcrumbs */}
      <nav className="w-full max-w-6xl mb-4 text-sm" aria-label="Breadcrumb">
        <ol className="list-reset flex text-gray-600">
          <li><Link href="/" className="hover:text-blue-700">Home</Link></li>
          <li className="mx-2">/</li>
          <li><Link href="/ranking" className="hover:text-blue-700">Ranking</Link></li>
          <li className="mx-2">/</li>
          <li><Link href={`/ranking/${year}`} className="hover:text-blue-700">{year}</Link></li>
          <li className="mx-2">/</li>
          <li className="text-blue-700 font-semibold capitalize">{category}</li>
        </ol>
      </nav>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-8 text-center drop-shadow-lg animate-slideup">{category.charAt(0).toUpperCase() + category.slice(1)} Rankings for {year}</h1>
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          <select
            value={region}
            onChange={e => {
              setRegion(e.target.value);
              setState('All');
            }}
            className="p-2 border rounded"
          >
            <option value="All">All Regions</option>
            {Object.keys(REGIONS).map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <select
            value={state}
            onChange={e => setState(e.target.value)}
            className="p-2 border rounded"
            disabled={region !== 'All'}
          >
            {filteredStates.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {region !== 'All' && (
            <span className="text-xs text-gray-500 ml-2">(State is optional when region is selected)</span>
          )}
        </div>
        <div className="bg-white/80 rounded-3xl shadow-2xl p-8 mb-10 border border-blue-100 animate-fadein delay-200">
          {error && (
            <div className="col-span-1 md:col-span-3 p-4 border border-red-200 bg-red-50 rounded-lg shadow-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}
          {rankings.length > 0 && (
            <div className="overflow-x-auto rounded-2xl shadow-xl bg-white/90 backdrop-blur border border-blue-100 animate-fadein delay-300">
              <table className="min-w-full bg-transparent">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="px-4 py-2">Rank</th>
                    <th className="px-4 py-2">Institution</th>
                    <th className="px-4 py-2">Score</th>
                    <th className="px-4 py-2">State</th>
                    <th className="px-4 py-2">Report</th>
                  </tr>
                </thead>
                <tbody>
                  {rankings.map((ranking, index) => (
                    <tr key={ranking._id} className={index % 2 === 0 ? 'bg-blue-50/40 hover:bg-blue-100/60 transition-all' : 'bg-white/60 hover:bg-blue-50/60 transition-all'}>
                      <td className="px-4 py-2 font-bold text-blue-700">{ranking.rank}</td>
                      <td className="px-4 py-2 font-semibold">{ranking.institution}</td>
                      <td className="px-4 py-2">{ranking.score}</td>
                      <td className="px-4 py-2">{ranking.state}</td>
                      <td className="px-4 py-2">
                        <a
                          href={`/reports/${ranking._id}.pdf`}
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
          )}
        </div>
      </div>
      <style jsx>{`
        .animate-fadein { animation: fadein 1s ease; }
        .animate-slideup { animation: slideup 1s cubic-bezier(.4,2,.6,1); }
        @keyframes fadein { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideup { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </main>
  );
}
