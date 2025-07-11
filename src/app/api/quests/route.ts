import { NextResponse } from 'next/server';
import { loadQuests } from '@/lib/xpUtils';

export async function GET() {
  try {
    const quests = loadQuests();
    return NextResponse.json(quests);
  } catch (error) {
    console.error('Error loading quests:', error);
    return NextResponse.json(
      { error: 'Failed to load quests' },
      { status: 500 }
    );
  }
}