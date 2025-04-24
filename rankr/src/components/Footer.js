'use client';
import { useEffect, useState } from 'react';

const Footer = () => {
  const [year, setYear] = useState(); // don't set initial year
  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);
  return (
    <footer className="bg-gray-100 text-gray-700 border-t mt-10">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div className="text-center md:text-left">
          <p className="text-sm">&copy; {year ? year : ''} Rankify. All rights reserved.</p>
          <p className="text-xs mt-1">Contact: <a href="mailto:info@rankify.com" className="text-blue-600 hover:underline">info@rankify.com</a></p>
        </div>
        <div className="flex gap-6 text-sm">
          <a href="/" className="hover:text-blue-600 transition">Home</a>
          <a href="/ranking" className="hover:text-blue-600 transition">Rankings</a>
          <a href="/parameters" className="hover:text-blue-600 transition">Parameters</a>
          <a href="/documents" className="hover:text-blue-600 transition">Documents</a>
          <a href="/faqs" className="hover:text-blue-600 transition">FAQs</a>
          <a href="/contact" className="hover:text-blue-600 transition">Contact</a>
        </div>
        <div className="flex gap-4">
          <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-blue-600">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557a9.93 9.93 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.564-2.005.974-3.127 1.195A4.92 4.92 0 0 0 16.616 3c-2.73 0-4.942 2.21-4.942 4.932 0 .386.045.763.127 1.124C7.728 8.807 4.1 6.884 1.671 3.965c-.423.722-.666 1.561-.666 2.475 0 1.708.87 3.216 2.188 4.099a4.904 4.904 0 0 1-2.237-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 0 1-2.224.084c.627 1.956 2.444 3.377 4.6 3.417A9.867 9.867 0 0 1 0 21.543a13.94 13.94 0 0 0 7.548 2.209c9.057 0 14.009-7.496 14.009-13.986 0-.213-.005-.425-.014-.636A9.936 9.936 0 0 0 24 4.557z"/></svg>
          </a>
          <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-blue-600">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.691v-3.622h3.129V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.325-.592 1.325-1.326V1.326C24 .592 23.405 0 22.675 0"/></svg>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
