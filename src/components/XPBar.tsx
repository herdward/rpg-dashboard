interface XPBarProps {
  domain: string;
  level: number;
  currentXP: number;
  progressPercent: number;
  totalXP: number;
  currentStreak?: number;
  longestStreak?: number;
}

export default function XPBar({ domain, level, currentXP, progressPercent, totalXP, currentStreak, longestStreak }: XPBarProps) {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 hover:bg-gray-800/70 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">{domain}</h3>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-cyan-400">Lv.{level}</span>
          <div className="bg-gradient-to-r from-purple-500 to-cyan-500 px-3 py-1 rounded-full text-sm font-semibold text-white">
            {totalXP} XP
          </div>
        </div>
      </div>
      
      <div className="relative">
        <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 via-cyan-500 to-purple-500 rounded-full transition-all duration-1000 ease-out relative"
            style={{ width: `${progressPercent}%` }}
          >
            <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
            <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full animate-shimmer"></div>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-gray-400">
            {currentXP} / 100 XP
          </span>
          <span className="text-sm text-cyan-400 font-semibold">
            {100 - currentXP} XP to Lv.{level + 1}
          </span>
        </div>
      </div>
      
      {(currentStreak || longestStreak) && (
        <div className="mt-4 pt-4 border-t border-gray-700/50 flex justify-around text-center">
          {currentStreak && currentStreak > 0 && (
            <div>
              <div className="text-lg font-bold text-orange-400">🔥 {currentStreak}</div>
              <div className="text-xs text-gray-400">Current Streak</div>
            </div>
          )}
          {longestStreak && longestStreak > 0 && (
            <div>
              <div className="text-lg font-bold text-purple-400">🏆 {longestStreak}</div>
              <div className="text-xs text-gray-400">Longest Streak</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}