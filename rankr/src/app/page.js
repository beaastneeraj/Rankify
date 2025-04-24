'use client';

import Link from 'next/link';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import { useEffect, useRef } from 'react';

export default function Home() {
  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slides: { perView: 1 },
  });

  const timer = useRef();
  useEffect(() => {
    if (!instanceRef.current) return;
    timer.current = setInterval(() => {
      instanceRef.current.next();
    }, 3000);
    return () => clearInterval(timer.current);
  }, [instanceRef]);

  const images = [
    '/carousel/1.png',
    '/carousel/2.webp',
    '/carousel/3.jpg',
  ];

  return (
    <main>
      {/* Carousel */}
      <div ref={sliderRef} className="keen-slider w-full h-[300px] md:h-[500px] overflow-hidden">
        {images.map((src, idx) => (
          <div key={idx} className="keen-slider__slide">
            <img
              src={src}
              alt={`Slide ${idx + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-20 text-center animate-fadein">
        <h1 className="text-5xl font-extrabold text-blue-700 mb-4 text-center drop-shadow-lg animate-slideup">Rankify</h1>
        <h2 className="text-xl text-gray-700 mb-8 text-center animate-slideup delay-100">The Smarter Way to Rank Colleges</h2>
        <p className="mb-8 text-lg text-center animate-fadein delay-200">
          Rankify empowers students, parents, and educators with transparent, data-driven, and unbiased college rankings—unlike NIRF, which often faces criticism for unfair and opaque ranking practices.
        </p>

        {/* Why Rankify is Better Than NIRF */}
        <section className="mt-16 bg-blue-50/80 py-12 px-6 sm:px-10 rounded-2xl shadow-xl border border-blue-200 animate-fadein delay-300">
          <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">Why Rankify is Better Than NIRF</h2>
          <ul className="list-disc pl-8 mb-8 text-lg">
            <li><span className="font-medium">Full Transparency:</span> Rankify’s methodology, parameters, and weightages are open and fully customizable. Users can see exactly how scores are calculated, unlike NIRF’s often opaque process.</li>
            <li><span className="font-medium">User Empowerment:</span> Rankify allows you to adjust ranking parameters to reflect what matters most to you—be it placements, research, faculty, or campus life—making the rankings truly personalized.</li>
            <li><span className="font-medium">No Institutional Bias:</span> Rankify is independent and free from government or institutional influence, ensuring a level playing field for all colleges and universities.</li>
            <li><span className="font-medium">Community-Driven Insights:</span> Students and alumni can contribute feedback, making the rankings more dynamic and reflective of real experiences.</li>
            <li><span className="font-medium">Regularly Updated:</span> Our rankings are updated yearly with the latest and most trusted data, so you always have the most current information.</li>
            <li><span className="font-medium">Open Access:</span> Anyone can explore, compare, and understand the rankings—no paywalls, no restrictions.</li>
          </ul>
          <p className="mb-8 text-center">
            Rankify is a student-led initiative focused on bringing clarity, credibility, and choice to college rankings in India. With Rankify, you get the tools and insights you need to make truly informed decisions about your future.
          </p>
        </section>

        {/* CTA Button */}
        <Link
          href="/ranking/"
          className="inline-block bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold text-lg px-8 py-4 rounded-xl shadow-lg hover:from-blue-700 hover:to-blue-500 transition-all duration-200 mt-12 animate-pop"
        >
          View Latest Rankings
        </Link>

        {/* About Us Section */}
        <section className="mt-24 text-left bg-white/80 py-16 px-6 sm:px-10 rounded-2xl shadow-xl animate-fadein delay-400">
          <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">About Us</h2>
          <p className="text-gray-700 text-lg max-w-4xl mx-auto text-center leading-relaxed">
            Rankify is a student-led initiative focused on bringing clarity and credibility to college rankings in India.
            We believe in transparency, data-backed evaluation, and student empowerment. 
            Whether you're a student looking for the best fit, a parent guiding your child, or an educator striving for excellence,
            Rankify provides the tools and insights you need to make informed choices.
          </p>
        </section>

        {/* Parameters Section */}
        <section className="mt-28 text-left animate-fadein delay-500">
          <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">How We Rank: Key Parameters Explained</h2>
          <ul className="grid gap-6 md:grid-cols-2 text-gray-700 text-lg list-disc list-inside max-w-4xl mx-auto">
            <li><b>Teaching, Learning & Resources (TLR):</b> Quality of teaching, learning environment, and resources.</li>
            <li><b>Student Strength (SS):</b> Total student enrollment, including doctoral students.</li>
            <li><b>Faculty-Student Ratio (FSR):</b> Emphasis on a healthy ratio, especially with permanent faculty.</li>
            <li><b>Faculty Quality & Experience (FQE):</b> Proportion of faculty with PhDs (or equivalent) and their experience.</li>
            <li><b>Financial Resources & Utilisation (FRU):</b> Availability and effective use of financial resources.</li>
            <li><b>Online Education (OE):</b> Adoption and quality of online education initiatives.</li>
            <li><b>Multiple Entry/Exit, Indian Knowledge System & Regional Languages (MIR):</b> Flexibility in academic pathways and promotion of Indian/regional knowledge.</li>
            <li><b>Research & Professional Practice (RP):</b> Research output and professional engagement.</li>
            <li><b>Publications (PU) & Quality of Publications (QP):</b> Number and quality of research publications.</li>
            <li><b>IPR & Patents (IPR):</b> Patents published and granted.</li>
            <li><b>Projects & Professional Practice (FPPP):</b> Impact and footprint of projects and professional practices.</li>
            <li><b>Publications & Citations in SDGs (PSDGs):</b> Research contributions towards Sustainable Development Goals.</li>
            <li><b>Graduation Outcomes (GO):</b> Success of students in university exams and after graduation.</li>
            <li><b>University Examinations (GUE):</b> Performance in university-level examinations.</li>
            <li><b>Ph.D. Graduates (GPHD):</b> Number of Ph.D. students graduated.</li>
            <li><b>Outreach & Inclusivity (OI):</b> Diversity and inclusivity on campus.</li>
            <li><b>Region Diversity (RD):</b> Percentage of students from other states/countries.</li>
            <li><b>Women Diversity (WD):</b> Percentage of women students.</li>
            <li><b>Economically & Socially Challenged Students (ESCS):</b> Support and inclusion for underprivileged students.</li>
            <li><b>Facilities for Physically Challenged Students (PCS):</b> Accessibility and support for differently-abled students.</li>
            <li><b>Perception (PR):</b> Reputation among academic peers and employers.</li>
          </ul>
        </section>

        {/* Features Section */}
        <section className="mt-28 grid gap-12 md:grid-cols-3 text-left animate-fadein delay-600">
          <div className="p-8 bg-gray-50/80 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <h3 className="text-2xl font-semibold text-blue-600 mb-4">Data-Driven</h3>
            <p className="text-gray-700 text-lg">
              Built on parameters that actually matter—placements, research, faculty, and more.
            </p>
          </div>

          <div className="p-8 bg-gray-50/80 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <h3 className="text-2xl font-semibold text-blue-600 mb-4">Transparent</h3>
            <p className="text-gray-700 text-lg">
              Know exactly why a college ranks where it does. No shady algorithms or hidden criteria.
            </p>
          </div>

          <div className="p-8 bg-gray-50/80 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <h3 className="text-2xl font-semibold text-blue-600 mb-4">Up-to-Date</h3>
            <p className="text-gray-700 text-lg">
              Rankings updated yearly with the latest and most trusted data from institutions.
            </p>
          </div>
        </section>

        {/* Parameters Section */}
        <section className="mt-28 text-left">
          <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">We Evaluate Based on 5 Key Parameters</h2>
          <ul className="grid gap-6 md:grid-cols-2 text-gray-700 text-lg list-disc list-inside max-w-3xl mx-auto">
            <li><span className="font-medium">Teaching and Learning Resources</span></li>
            <li><span className="font-medium">Research and Professional Practice</span></li>
            <li><span className="font-medium">Graduation Outcome</span></li>
            <li><span className="font-medium">Outreach and Inclusivity</span></li>
            <li><span className="font-medium">Perception</span></li>
          </ul>
        </section>
        <style jsx>{`
          .animate-fadein { animation: fadein 1s ease; }
          .animate-slideup { animation: slideup 1s cubic-bezier(.4,2,.6,1); }
          .animate-pop { transition: transform 0.15s; }
          .animate-pop:active { transform: scale(0.97); }
          .delay-100 { animation-delay: 0.1s; }
          .delay-200 { animation-delay: 0.2s; }
          .delay-300 { animation-delay: 0.3s; }
          .delay-400 { animation-delay: 0.4s; }
          .delay-500 { animation-delay: 0.5s; }
          .delay-600 { animation-delay: 0.6s; }
          @keyframes fadein { from { opacity: 0; } to { opacity: 1; } }
          @keyframes slideup { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        `}</style>
      </div>
    </main>
  );
}
