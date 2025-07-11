'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { XPLog } from '@/lib/xpUtils';

interface XPChartProps {
  logs: XPLog[];
  chartType?: 'line' | 'area';
}

interface ChartData {
  date: string;
  [key: string]: number | string;
}

const COLORS = [
  '#8b5cf6', // purple
  '#06b6d4', // cyan
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // purple (repeat)
  '#06b6d4', // cyan (repeat)
];

export default function XPChart({ logs, chartType = 'area' }: XPChartProps) {
  if (logs.length === 0) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">XP Progress Over Time</h3>
        <div className="text-center py-8">
          <div className="text-gray-400">No XP data to display yet</div>
        </div>
      </div>
    );
  }

  // Process logs to create chart data
  const processedData = (): ChartData[] => {
    // Sort logs by date
    const sortedLogs = [...logs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Group logs by date and domain
    const dateMap = new Map<string, { [domain: string]: number }>();
    
    sortedLogs.forEach(log => {
      if (!dateMap.has(log.date)) {
        dateMap.set(log.date, {});
      }
      const dateData = dateMap.get(log.date)!;
      dateData[log.domain] = (dateData[log.domain] || 0) + log.xp;
    });
    
    // Convert to cumulative data
    const domains = Array.from(new Set(logs.map(log => log.domain)));
    const cumulativeData: ChartData[] = [];
    const runningTotals: { [domain: string]: number } = {};
    
    // Initialize running totals
    domains.forEach(domain => {
      runningTotals[domain] = 0;
    });
    
    // Process each date
    Array.from(dateMap.entries()).forEach(([date, dayData]) => {
      // Add day's XP to running totals
      domains.forEach(domain => {
        runningTotals[domain] += dayData[domain] || 0;
      });
      
      // Create chart data point
      const chartPoint: ChartData = {
        date: new Date(date).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        }),
        ...runningTotals
      };
      
      cumulativeData.push(chartPoint);
    });
    
    return cumulativeData;
  };

  const chartData = processedData();
  const domains = Array.from(new Set(logs.map(log => log.domain)));

  const renderChart = () => {
    if (chartType === 'line') {
      return (
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="date" 
            stroke="#9ca3af"
            fontSize={12}
          />
          <YAxis 
            stroke="#9ca3af"
            fontSize={12}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '0.5rem',
              color: '#f3f4f6'
            }}
          />
          <Legend />
          {domains.map((domain, index) => (
            <Line
              key={domain}
              type="monotone"
              dataKey={domain}
              stroke={COLORS[index % COLORS.length]}
              strokeWidth={2}
              dot={{ fill: COLORS[index % COLORS.length], strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      );
    } else {
      return (
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="date" 
            stroke="#9ca3af"
            fontSize={12}
          />
          <YAxis 
            stroke="#9ca3af"
            fontSize={12}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '0.5rem',
              color: '#f3f4f6'
            }}
          />
          <Legend />
          {domains.map((domain, index) => (
            <Area
              key={domain}
              type="monotone"
              dataKey={domain}
              stackId="1"
              stroke={COLORS[index % COLORS.length]}
              fill={COLORS[index % COLORS.length]}
              fillOpacity={0.6}
            />
          ))}
        </AreaChart>
      );
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">XP Progress Over Time</h3>
        <div className="text-sm text-gray-400">
          {chartType === 'area' ? 'Cumulative Area Chart' : 'Cumulative Line Chart'}
        </div>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
}