'use client';

import { useState } from 'react';
import { getAllDomains } from '@/lib/xpUtils';

interface QuestFormProps {
  onSubmit: (questData: { domain: string; description: string; xp: number }) => void;
  onCancel: () => void;
  domains: string[];
}

export default function QuestForm({ onSubmit, onCancel, domains }: QuestFormProps) {
  const [domain, setDomain] = useState('');
  const [description, setDescription] = useState('');
  const [xp, setXp] = useState(50);
  const [customDomain, setCustomDomain] = useState('');
  const [useCustomDomain, setUseCustomDomain] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim()) return;
    
    const finalDomain = useCustomDomain ? customDomain.trim() : domain;
    if (!finalDomain) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        domain: finalDomain,
        description: description.trim(),
        xp
      });
      
      // Reset form
      setDomain('');
      setDescription('');
      setXp(50);
      setCustomDomain('');
      setUseCustomDomain(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
      <h3 className="text-xl font-bold text-white mb-4">Create New Quest</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Domain
          </label>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="existing-domain"
                name="domain-type"
                checked={!useCustomDomain}
                onChange={() => setUseCustomDomain(false)}
                className="text-cyan-500"
              />
              <label htmlFor="existing-domain" className="text-sm text-gray-300">
                Use existing domain
              </label>
            </div>
            
            {!useCustomDomain && (
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required={!useCustomDomain}
              >
                <option value="">Select a domain</option>
                {domains.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            )}
            
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="custom-domain"
                name="domain-type"
                checked={useCustomDomain}
                onChange={() => setUseCustomDomain(true)}
                className="text-cyan-500"
              />
              <label htmlFor="custom-domain" className="text-sm text-gray-300">
                Create new domain
              </label>
            </div>
            
            {useCustomDomain && (
              <input
                type="text"
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                placeholder="Enter domain name"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required={useCustomDomain}
              />
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What do you want to accomplish?"
            rows={3}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            XP Reward
          </label>
          <input
            type="number"
            value={xp}
            onChange={(e) => setXp(Number(e.target.value))}
            min="1"
            max="1000"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-gradient-to-r from-purple-500 to-cyan-500 text-white py-2 px-4 rounded-md hover:from-purple-600 hover:to-cyan-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating...' : 'Create Quest'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors duration-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}