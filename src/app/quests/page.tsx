'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import QuestCard from '@/components/QuestCard';
import QuestForm from '@/components/QuestForm';
import { Quest, getAllDomains } from '@/lib/xpUtils';

export default function QuestsPage() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [domains, setDomains] = useState<string[]>([]);

  useEffect(() => {
    fetchQuests();
    fetchDomains();
  }, []);

  const fetchQuests = async () => {
    try {
      const response = await fetch('/api/quests');
      const data = await response.json();
      setQuests(data);
    } catch (error) {
      console.error('Error fetching quests:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDomains = async () => {
    try {
      const response = await fetch('/api/domains');
      const data = await response.json();
      setDomains(data);
    } catch (error) {
      console.error('Error fetching domains:', error);
    }
  };

  const handleCompleteQuest = async (questId: string) => {
    try {
      const response = await fetch('/api/quests/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ questId }),
      });

      if (response.ok) {
        await fetchQuests();
      }
    } catch (error) {
      console.error('Error completing quest:', error);
    }
  };

  const handleUndoQuest = async (questId: string) => {
    try {
      const response = await fetch('/api/quests/undo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ questId }),
      });

      if (response.ok) {
        await fetchQuests();
      }
    } catch (error) {
      console.error('Error undoing quest:', error);
    }
  };

  const handleCreateQuest = async (questData: { domain: string; description: string; xp: number }) => {
    try {
      const response = await fetch('/api/quests/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(questData),
      });

      if (response.ok) {
        await fetchQuests();
        await fetchDomains();
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error creating quest:', error);
    }
  };

  const handleArchiveQuest = async (questId: string) => {
    try {
      const response = await fetch('/api/quests/archive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ questId }),
      });

      if (response.ok) {
        await fetchQuests();
      }
    } catch (error) {
      console.error('Error archiving quest:', error);
    }
  };

  const handleUnarchiveQuest = async (questId: string) => {
    try {
      const response = await fetch('/api/quests/unarchive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ questId }),
      });

      if (response.ok) {
        await fetchQuests();
      }
    } catch (error) {
      console.error('Error unarchiving quest:', error);
    }
  };

  const activeQuests = quests.filter(quest => !quest.completed && !quest.archived);
  const completedQuests = quests.filter(quest => quest.completed && !quest.archived);
  const archivedQuests = quests.filter(quest => quest.archived);

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
              Quests
            </span>
          </h1>
          <p className="text-gray-300">Complete quests to earn XP</p>
          <button
            onClick={() => setShowForm(!showForm)}
            className="mt-4 bg-gradient-to-r from-purple-500 to-cyan-500 text-white py-2 px-4 rounded-md hover:from-purple-600 hover:to-cyan-600 transition-all duration-200"
          >
            {showForm ? 'Hide Form' : 'Create New Quest'}
          </button>
        </header>

        <main>
          {showForm && (
            <div className="mb-8">
              <QuestForm
                onSubmit={handleCreateQuest}
                onCancel={() => setShowForm(false)}
                domains={domains}
              />
            </div>
          )}
          
          {loading ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg">Loading quests...</div>
            </div>
          ) : (
            <div className="space-y-8">
              {activeQuests.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold text-white mb-6">Active Quests</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeQuests.map((quest) => (
                      <QuestCard
                        key={quest.id}
                        quest={quest}
                        onComplete={handleCompleteQuest}
                        onUndo={handleUndoQuest}
                        onArchive={handleArchiveQuest}
                        onUnarchive={handleUnarchiveQuest}
                      />
                    ))}
                  </div>
                </section>
              )}

              {completedQuests.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold text-white mb-6">Completed Quests</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {completedQuests.map((quest) => (
                      <QuestCard
                        key={quest.id}
                        quest={quest}
                        onComplete={handleCompleteQuest}
                        onUndo={handleUndoQuest}
                        onArchive={handleArchiveQuest}
                        onUnarchive={handleUnarchiveQuest}
                      />
                    ))}
                  </div>
                </section>
              )}

              {archivedQuests.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold text-white mb-6">Archived Quests</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {archivedQuests.map((quest) => (
                      <QuestCard
                        key={quest.id}
                        quest={quest}
                        onComplete={handleCompleteQuest}
                        onUndo={handleUndoQuest}
                        onArchive={handleArchiveQuest}
                        onUnarchive={handleUnarchiveQuest}
                      />
                    ))}
                  </div>
                </section>
              )}

              {quests.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-lg">No quests available yet.</div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}