'use client'; // Ensure the component is client-side

import { useEffect, useState, use } from 'react';
import { TrendingUp, Cpu, Heart } from 'lucide-react'; // Import Lucide icons
import Link from 'next/link'; // Import Link from Next.js
import { categories, categoryText, categoryIcons } from '@/lib/config';

export default function RankingPage({ params }) {
  const { year } = use(params); // Get the year directly from props

  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted before rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Prevent rendering until the component is mounted
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 py-16">
      {/* Breadcrumbs */}
      <nav className="w-full max-w-6xl mb-4 text-sm" aria-label="Breadcrumb">
        <ol className="list-reset flex text-gray-600">
          <li><Link href="/" className="hover:text-blue-700">Home</Link></li>
          <li className="mx-2">/</li>
          <li><Link href="/ranking" className="hover:text-blue-700">Ranking</Link></li>
          <li className="mx-2">/</li>
          <li className="text-blue-700 font-semibold">{year}</li>
        </ol>
      </nav>

      <h1 className="text-4xl font-bold text-blue-700 mb-6">Rankings for {year}</h1>

      <p className="text-lg text-gray-700 mb-10 text-center max-w-2xl">
        Our comprehensive rankings provide insights into the top institutions in various fields based on multiple factors.
        Explore the categories below to get detailed rankings in overall, engineering, and medical disciplines for the year {year}.
      </p>

      <div className="grid gap-8 md:grid-cols-3 text-center mb-12">        
        {categories.map((category) => {
          const Icon = categoryIcons[category]; // Get the icon component based on the category
          const text = categoryText[category]; // Get the text based on the category
          return (
            <Link
              href={`/ranking/${year}/${category}`}
              key={category}
              className="bg-white shadow-lg p-6 rounded-lg transform hover:scale-105 transition-all flex flex-col items-center text-gray-800 border border-gray-300"
            >
              {Icon}
              <h2 className="font-bold text-xl capitalize">{category}</h2>
              <p className="text-sm mt-2">{text}</p>
            </Link>
        )})}
      </div>

      <p className="text-lg text-gray-700 text-center max-w-2xl">
        These rankings are based on five key parameters: Teacher and Learning Resources, Research and Professional Practice,
        Graduation Outcomes, Outreach and Inclusivity, and Perception. Each of these contributes to the overall score and
        positioning of institutions in these categories.
      </p>
    </main>
  );
}
