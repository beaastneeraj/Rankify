'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const rankingYears = [
  '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016'
];

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Parameters', href: '/parameters' },
  { name: 'Ranking', href: '/ranking/2024', dropdown: true },
  { name: 'Documents', href: '/documents' },
  { name: 'Notification/Advt', href: '/notifications' },
  { name: 'FAQs', href: '/faqs' },
  { name: 'Contact', href: '/contact' },
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="w-full bg-white/90 shadow-sm z-50 sticky top-0 backdrop-blur border-b border-gray-200">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 py-0 h-12">
        {/* Logo and Title */}
        <div className="flex items-center gap-3">
          <img src="/logo.jpg" alt="Rankify Logo" className="h-8 w-8 rounded bg-white p-0.5 border border-gray-200 shadow-sm" />
          <span className="text-lg font-semibold text-[#142A63] tracking-wide">Rankify</span>
        </div>
        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-1 h-full">
          {navItems.map((item) =>
            item.dropdown ? (
              <li key={item.name} className="relative h-full flex items-center">
                <button
                  className={`px-3 py-3 h-full flex items-center text-[#142A63] hover:bg-blue-50 hover:text-[#E74C3C] transition-colors rounded-md ${pathname.startsWith('/ranking') ? 'bg-blue-50 text-[#E74C3C] font-semibold' : ''}`}
                  onMouseEnter={() => setDropdownOpen(true)}
                  onMouseLeave={() => setDropdownOpen(false)}
                  onClick={() => setDropdownOpen((v) => !v)}
                >
                  Ranking
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </button>
                {dropdownOpen && (
                  <ul
                    className="absolute left-0 top-full mt-0 w-40 bg-white text-[#142A63] shadow-lg rounded-b z-50 border border-gray-100"
                    onMouseEnter={() => setDropdownOpen(true)}
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    {rankingYears.map((year) => (
                      <li key={year}>
                        <Link
                          href={`/ranking/${year}`}
                          className="block px-4 py-2 hover:bg-blue-50 hover:text-[#E74C3C] transition-colors rounded"
                          onClick={() => { setMenuOpen(false); setDropdownOpen(false); }}
                        >
                          {year}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ) : (
              <li key={item.name} className="h-full flex items-center">
                <Link
                  href={item.href}
                  className={`px-3 py-3 h-full flex items-center hover:bg-blue-50 hover:text-[#E74C3C] transition-colors rounded-md ${pathname === item.href ? 'bg-blue-50 text-[#E74C3C] font-semibold' : 'text-[#142A63]'}`}
                >
                  {item.name}
                </Link>
              </li>
            )
          )}
        </ul>
        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-[#142A63] focus:outline-none"
            aria-label="Toggle Menu"
          >
            <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>
      {/* Mobile Menu */}
      {menuOpen && (
        <ul className="md:hidden bg-white/95 text-[#142A63] flex flex-col w-full px-4 pb-4 animate-fade-in border-b border-gray-100 shadow-sm">
          {navItems.map((item) =>
            item.dropdown ? (
              <li key={item.name} className="relative">
                <button
                  className="w-full text-left px-4 py-3 flex items-center justify-between hover:bg-blue-50 hover:text-[#E74C3C] rounded transition-colors"
                  onClick={() => setDropdownOpen((v) => !v)}
                >
                  Ranking
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </button>
                {dropdownOpen && (
                  <ul className="bg-white text-[#142A63] shadow-lg rounded-b w-full border border-gray-100">
                    {rankingYears.map((year) => (
                      <li key={year}>
                        <Link
                          href={`/ranking/${year}`}
                          className="block px-4 py-2 hover:bg-blue-50 hover:text-[#E74C3C] transition-colors rounded"
                          onClick={() => { setMenuOpen(false); setDropdownOpen(false); }}
                        >
                          {year}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ) : (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`block px-4 py-3 hover:bg-blue-50 hover:text-[#E74C3C] transition-colors rounded ${pathname === item.href ? 'bg-blue-50 text-[#E74C3C] font-semibold' : ''}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.name}
                </Link>
              </li>
            )
          )}
        </ul>
      )}
    </header>
  );
};

export default Header;
