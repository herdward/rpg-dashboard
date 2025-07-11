'use client';

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { DomainStats } from '@/lib/xpUtils';

interface SkillRadarProps {
  domainStats: DomainStats[];
}

interface RadarData {
  domain: string;
  level: number;
  totalXP: number;
  fullMark: number;
}

export default function SkillRadar({ domainStats }: SkillRadarProps) {
  if (domainStats.length === 0) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">Skill Levels</h3>
        <div className="text-center py-8">
          <div className="text-gray-400">No skill data to display yet</div>
        </div>
      </div>
    );
  }

  // Process domain stats for radar chart
  const processRadarData = (): RadarData[] => {
    const maxLevel = Math.max(...domainStats.map(stat => stat.level));
    const fullMark = Math.max(maxLevel + 2, 10); // Set a reasonable maximum for the radar

    return domainStats.map(stat => ({
      domain: stat.domain,
      level: stat.level,
      totalXP: stat.totalXP,
      fullMark
    }));
  };

  const radarData = processRadarData();

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-lg">
          <p className="text-white font-semibold">{label}</p>
          <p className="text-cyan-400">
            Level: {data.level}
          </p>
          <p className="text-purple-400">
            Total XP: {data.totalXP}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">Skill Levels</h3>
        <div className="text-sm text-gray-400">
          Radar Chart
        </div>
      </div>
      
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData}>
            <PolarGrid stroke="#374151" />
            <PolarAngleAxis 
              dataKey="domain" 
              tick={{ fill: '#9ca3af', fontSize: 12 }}
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 'dataMax']} 
              tick={{ fill: '#9ca3af', fontSize: 10 }}
              tickCount={6}
            />
            <Radar
              name="Level"
              dataKey="level"
              stroke="#8b5cf6"
              fill="rgba(139, 92, 246, 0.3)"
              fillOpacity={0.6}
              strokeWidth={2}
              dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
            />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 text-center">
        <div className="text-sm text-gray-400">
          Higher levels extend further from the center
        </div>
      </div>
    </div>
  );
}