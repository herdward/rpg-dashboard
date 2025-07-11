import Link from 'next/link';
import LogForm from '@/components/LogForm';
import { getAllDomains } from '@/lib/xpUtils';

export default function LogPage() {
  const domains = getAllDomains();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <Link
            href="/"
            className="inline-block text-cyan-400 hover:text-cyan-300 mb-4 transition-colors"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Log XP
            </span>
          </h1>
          <p className="text-gray-300">Add experience points to your domains</p>
        </header>

        <main>
          <LogForm domains={domains} />
        </main>
      </div>
    </div>
  );
}