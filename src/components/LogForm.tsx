'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface LogFormProps {
  domains: string[];
}

export default function LogForm({ domains }: LogFormProps) {
  const [domain, setDomain] = useState('');
  const [task, setTask] = useState('');
  const [xp, setXp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain || !task || !xp) return;

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          domain,
          task,
          xp: parseInt(xp),
        }),
      });

      if (response.ok) {
        setShowSuccess(true);
        setTimeout(() => {
          router.push('/');
        }, 1500);
      }
    } catch (error) {
      console.error('Error logging XP:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-8 hover:bg-gray-800/70 transition-all duration-300">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Log XP</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="domain" className="block text-sm font-medium text-gray-300 mb-2">
              Domain
            </label>
            <select
              id="domain"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
              required
            >
              <option value="">Select a domain</option>
              {domains.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="task" className="block text-sm font-medium text-gray-300 mb-2">
              Task Description
            </label>
            <input
              type="text"
              id="task"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
              placeholder="What did you accomplish?"
              required
            />
          </div>

          <div>
            <label htmlFor="xp" className="block text-sm font-medium text-gray-300 mb-2">
              XP Earned
            </label>
            <input
              type="number"
              id="xp"
              value={xp}
              onChange={(e) => setXp(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
              placeholder="How much XP did you earn?"
              min="1"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-600 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
          >
            {isLoading ? 'Logging...' : 'Log XP'}
          </button>
        </form>

        {showSuccess && (
          <div className="mt-4 p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-400 text-center animate-pulse">
            ✅ XP logged successfully! Redirecting...
          </div>
        )}
      </div>
    </div>
  );
}