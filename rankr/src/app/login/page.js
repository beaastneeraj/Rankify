'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        alert('Login successful!');
        router.push('/'); // Redirect to home
      } else {
        const errorData = await res.json();
        setError(`Login failed: ${errorData.message || 'Invalid credentials'}`);
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 animate-fadein">
      <div className="w-full max-w-md p-10 rounded-3xl shadow-2xl bg-white/80 backdrop-blur-lg border border-blue-100 flex flex-col items-center animate-slideup">
        <img src="/logo.jpg" alt="Rankify Logo" className="h-20 w-20 mb-4 rounded-full shadow-lg" />
        <h1 className="text-3xl font-extrabold text-blue-700 mb-2 tracking-tight">Welcome to Rankify</h1>
        <p className="mb-6 text-gray-600 text-center">Sign in to access your personalized college rankings</p>
        <form className="w-full space-y-6" onSubmit={handleLogin}>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-blue-200 bg-blue-50 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-200 text-lg shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-blue-200 bg-blue-50 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-200 text-lg shadow-sm"
              required
            />
          </div>
          {error && <div className="text-red-500 text-center font-semibold bg-red-50 border border-red-200 rounded-xl p-2 animate-fadein">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-400 text-white font-bold shadow-lg hover:from-blue-700 hover:to-blue-500 transition-all duration-200 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 animate-pop"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
      <style jsx>{`
        .animate-fadein { animation: fadein 1s ease; }
        .animate-slideup { animation: slideup 1s cubic-bezier(.4,2,.6,1); }
        .animate-pop { transition: transform 0.15s; }
        .animate-pop:active { transform: scale(0.97); }
        @keyframes fadein { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideup { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </main>
  );
}
