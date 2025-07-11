import fs from 'fs';
import path from 'path';

export interface XPLog {
  domain: string;
  task: string;
  xp: number;
  date: string;
}

export interface Quest {
  id: string;
  domain: string;
  description: string;
  xp: number;
  completed: boolean;
  archived?: boolean;
}

export interface StreakStats {
  currentStreak: number;
  longestStreak: number;
  lastLogDate: string;
}

export interface DomainStats {
  domain: string;
  totalXP: number;
  level: number;
  progressPercent: number;
  streaks?: StreakStats;
}

const LOG_FILE = path.join(process.cwd(), 'data', 'log.json');
const QUESTS_FILE = path.join(process.cwd(), 'data', 'quests.json');

export function loadXPLogs(): XPLog[] {
  try {
    const data = fs.readFileSync(LOG_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading XP logs:', error);
    return [];
  }
}

export function loadQuests(): Quest[] {
  try {
    const data = fs.readFileSync(QUESTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading quests:', error);
    return [];
  }
}

export function loadStreaks(): Record<string, StreakStats> {
  const STREAKS_FILE = path.join(process.cwd(), 'data', 'streaks.json');
  try {
    if (!fs.existsSync(STREAKS_FILE)) {
      return {};
    }
    const data = fs.readFileSync(STREAKS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading streaks:', error);
    return {};
  }
}

export function calculateLevel(totalXP: number): number {
  return Math.floor(totalXP / 100);
}

export function calculateProgress(totalXP: number): number {
  return totalXP % 100;
}

export function getDomainStats(logs: XPLog[]): DomainStats[] {
  const domainTotals: { [key: string]: number } = {};
  
  logs.forEach(log => {
    domainTotals[log.domain] = (domainTotals[log.domain] || 0) + log.xp;
  });

  return Object.entries(domainTotals).map(([domain, totalXP]) => ({
    domain,
    totalXP,
    level: calculateLevel(totalXP),
    progressPercent: calculateProgress(totalXP)
  }));
}

function updateStreaks(domain: string, logDateStr: string): void {
  const STREAKS_FILE = path.join(process.cwd(), 'data', 'streaks.json');
  const allStreaks = loadStreaks();
  const domainStreak = allStreaks[domain] || {
    currentStreak: 0,
    longestStreak: 0,
    lastLogDate: '',
  };

  const logDate = new Date(logDateStr);
  // Set to midnight to compare dates easily
  logDate.setHours(0, 0, 0, 0);

  if (domainStreak.lastLogDate) {
    const lastLogDate = new Date(domainStreak.lastLogDate);
    lastLogDate.setHours(0, 0, 0, 0);

    const diffTime = logDate.getTime() - lastLogDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      // Consecutive day
      domainStreak.currentStreak += 1;
    } else if (diffDays > 1) {
      // Streak broken
      domainStreak.currentStreak = 1;
    }
    // If diffDays is 0 or less, it's the same day or a past entry, so we don't change the streak.
  } else {
    // First log for this domain
    domainStreak.currentStreak = 1;
  }

  if (domainStreak.currentStreak > domainStreak.longestStreak) {
    domainStreak.longestStreak = domainStreak.currentStreak;
  }

  domainStreak.lastLogDate = logDateStr;
  allStreaks[domain] = domainStreak;

  try {
    fs.writeFileSync(STREAKS_FILE, JSON.stringify(allStreaks, null, 2));
  } catch (error) {
    console.error('Error saving streaks:', error);
  }
}

export function addXPLog(log: Omit<XPLog, 'date'>): void {
  const logs = loadXPLogs();
  const newLog: XPLog = {
    ...log,
    date: new Date().toISOString().split('T')[0]
  };
  
  logs.push(newLog);
  
  try {
    updateStreaks(newLog.domain, newLog.date);
    fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2));
  } catch (error) {
    console.error('Error saving XP log:', error);
    throw error;
  }
}

export function completeQuest(questId: string): void {
  const quests = loadQuests();
  const quest = quests.find(q => q.id === questId);
  
  if (!quest) {
    throw new Error('Quest not found');
  }
  
  if (quest.completed) {
    throw new Error('Quest already completed');
  }
  
  quest.completed = true;
  
  try {
    fs.writeFileSync(QUESTS_FILE, JSON.stringify(quests, null, 2));
    
    addXPLog({
      domain: quest.domain,
      task: quest.description,
      xp: quest.xp
    });
  } catch (error) {
    console.error('Error completing quest:', error);
    throw error;
  }
}

export function undoQuestCompletion(questId: string): void {
  const quests = loadQuests();
  const quest = quests.find(q => q.id === questId);
  
  if (!quest) {
    throw new Error('Quest not found');
  }
  
  if (!quest.completed) {
    throw new Error('Quest is not completed');
  }
  
  quest.completed = false;
  
  try {
    fs.writeFileSync(QUESTS_FILE, JSON.stringify(quests, null, 2));
    
    // Remove the XP log entry for this quest
    const logs = loadXPLogs();
    const updatedLogs = logs.filter(log => 
      !(log.domain === quest.domain && 
        log.task === quest.description && 
        log.xp === quest.xp)
    );
    
    fs.writeFileSync(LOG_FILE, JSON.stringify(updatedLogs, null, 2));
  } catch (error) {
    console.error('Error undoing quest completion:', error);
    throw error;
  }
}

export function addQuest(quest: Omit<Quest, 'id' | 'completed'>): void {
  const quests = loadQuests();
  const newQuest: Quest = {
    ...quest,
    id: Date.now().toString(),
    completed: false
  };
  
  quests.push(newQuest);
  
  try {
    fs.writeFileSync(QUESTS_FILE, JSON.stringify(quests, null, 2));
  } catch (error) {
    console.error('Error adding quest:', error);
    throw error;
  }
}

export function archiveQuest(questId: string): void {
  const quests = loadQuests();
  const quest = quests.find(q => q.id === questId);
  
  if (!quest) {
    throw new Error('Quest not found');
  }
  
  quest.archived = true;
  
  try {
    fs.writeFileSync(QUESTS_FILE, JSON.stringify(quests, null, 2));
  } catch (error) {
    console.error('Error archiving quest:', error);
    throw error;
  }
}

export function unarchiveQuest(questId: string): void {
  const quests = loadQuests();
  const quest = quests.find(q => q.id === questId);
  
  if (!quest) {
    throw new Error('Quest not found');
  }
  
  quest.archived = false;
  
  try {
    fs.writeFileSync(QUESTS_FILE, JSON.stringify(quests, null, 2));
  } catch (error) {
    console.error('Error unarchiving quest:', error);
    throw error;
  }
}

export function getRecentLogs(days: number = 30): XPLog[] {
  const logs = loadXPLogs();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return logs.filter(log => new Date(log.date) >= cutoffDate);
}

export function getAllDomains(): string[] {
  const logs = loadXPLogs();
  const quests = loadQuests();
  
  const domains = new Set<string>();
  logs.forEach(log => domains.add(log.domain));
  quests.forEach(quest => domains.add(quest.domain));
  
  return Array.from(domains).sort();
}