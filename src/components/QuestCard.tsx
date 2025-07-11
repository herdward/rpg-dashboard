'use client';

import { useState } from 'react';
import { Quest } from '@/lib/xpUtils';

interface QuestCardProps {
  quest: Quest;
  onComplete: (questId: string) => void;
  onUndo?: (questId: string) => void;
  onArchive?: (questId: string) => void;
  onUnarchive?: (questId: string) => void;
}

export default function QuestCard({ quest, onComplete, onUndo, onArchive, onUnarchive }: QuestCardProps) {
  const [isCompleting, setIsCompleting] = useState(false);
  const [isUndoing, setIsUndoing] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);

  const handleComplete = async () => {
    if (quest.completed) return;
    
    setIsCompleting(true);
    try {
      await onComplete(quest.id);
    } finally {
      setIsCompleting(false);
    }
  };

  const handleUndo = async () => {
    if (!quest.completed || !onUndo) return;
    
    setIsUndoing(true);
    try {
      await onUndo(quest.id);
    } finally {
      setIsUndoing(false);
    }
  };

  const handleArchive = async () => {
    if (!onArchive && !onUnarchive) return;
    
    setIsArchiving(true);
    try {
      if (quest.archived) {
        await onUnarchive?.(quest.id);
      } else {
        await onArchive?.(quest.id);
      }
    } finally {
      setIsArchiving(false);
    }
  };

  return (
    <div className={`bg-gray-800/50 backdrop-blur-sm border rounded-lg p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl ${
      quest.archived 
        ? 'border-yellow-500 hover:shadow-yellow-500/20 opacity-75' 
        : quest.completed 
          ? 'border-green-500 hover:shadow-green-500/20' 
          : 'border-gray-700 hover:bg-gray-800/70 hover:shadow-cyan-500/20'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-cyan-400 bg-cyan-400/20 px-2 py-1 rounded">
              {quest.domain}
            </span>
            <span className="text-sm font-semibold text-purple-400">
              {quest.xp} XP
            </span>
            {quest.archived && (
              <span className="text-xs font-medium text-yellow-400 bg-yellow-400/20 px-2 py-1 rounded">
                ARCHIVED
              </span>
            )}
          </div>
          <h3 className={`text-lg font-semibold ${
            quest.archived ? 'text-yellow-400 italic' : quest.completed ? 'text-green-400 line-through' : 'text-white'
          }`}>
            {quest.description}
          </h3>
        </div>
        
        <div className="ml-4 flex items-center gap-2">
          {quest.completed ? (
            <>
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">✓</span>
              </div>
              {onUndo && (
                <button
                  onClick={handleUndo}
                  disabled={isUndoing}
                  className="w-8 h-8 bg-red-500/20 border border-red-500 rounded-full hover:bg-red-500/30 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  title="Undo completion"
                >
                  {isUndoing ? (
                    <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <span className="text-red-400 font-bold">↶</span>
                  )}
                </button>
              )}
            </>
          ) : (
            <button
              onClick={handleComplete}
              disabled={isCompleting}
              className="w-8 h-8 border-2 border-gray-500 rounded-full hover:border-cyan-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCompleting && (
                <div className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              )}
            </button>
          )}
          
          {(onArchive || onUnarchive) && (
            <button
              onClick={handleArchive}
              disabled={isArchiving}
              className={`w-8 h-8 border rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center ${
                quest.archived 
                  ? 'bg-yellow-500/20 border-yellow-500 hover:bg-yellow-500/30' 
                  : 'bg-gray-500/20 border-gray-500 hover:bg-gray-500/30'
              }`}
              title={quest.archived ? 'Unarchive quest' : 'Archive quest'}
            >
              {isArchiving ? (
                <div className={`w-4 h-4 border-2 border-t-transparent rounded-full animate-spin ${
                  quest.archived ? 'border-yellow-500' : 'border-gray-500'
                }`}></div>
              ) : (
                <span className={`font-bold ${quest.archived ? 'text-yellow-400' : 'text-gray-400'}`}>
                  {quest.archived ? '📂' : '📁'}
                </span>
              )}
            </button>
          )}
        </div>
      </div>
      
      {quest.completed && (
        <div className="mt-4 p-2 bg-green-500/20 border border-green-500/50 rounded text-green-400 text-sm text-center">
          Quest Completed! XP has been added to your {quest.domain} progress.
        </div>
      )}
    </div>
  );
}