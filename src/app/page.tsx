import Link from 'next/link';
import XPBar from '@/components/XPBar';
import XPChart from '@/components/XPChart';
import SkillRadar from '@/components/SkillRadar';
import { loadXPLogs, getDomainStats, loadStreaks } from '@/lib/xpUtils';

export default function Home() {
  const logs = loadXPLogs();
  const streaks = loadStreaks();
  const domainStats = getDomainStats(logs);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              RPG Dashboard
            </span>
          </h1>
          <p className="text-gray-300 text-lg">Track your real-life progress like a video game</p>
          
          <div className="flex justify-center gap-4 mt-8">
            <Link
              href="/log"
              className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-cyan-600 transition-all duration-200 transform hover:scale-105"
            >
              Log XP
            </Link>
            <Link
              href="/quests"
              className="bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-all duration-200 transform hover:scale-105"
            >
              View Quests
            </Link>
          </div>
        </header>

        <main>
          {logs.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <XPChart logs={logs} chartType="area" />
              <SkillRadar domainStats={domainStats} />
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {domainStats.map((stats) => (
              <XPBar
                key={stats.domain}
                domain={stats.domain}
                level={stats.level}
                currentXP={stats.progressPercent}
                progressPercent={stats.progressPercent}
                totalXP={stats.totalXP}
                currentStreak={streaks[stats.domain]?.currentStreak}
                longestStreak={streaks[stats.domain]?.longestStreak}
              />
            ))}
          </div>

          {domainStats.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-4">
                No XP logged yet. Start your journey!
              </div>
              <Link
                href="/log"
                className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-cyan-600 transition-all duration-200 transform hover:scale-105"
              >
                Log Your First XP
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
