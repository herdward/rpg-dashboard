import { NextRequest, NextResponse } from 'next/server';
import { completeQuest } from '@/lib/xpUtils';

export async function POST(request: NextRequest) {
  try {
    const { questId } = await request.json();
    
    if (!questId) {
      return NextResponse.json(
        { error: 'Quest ID is required' },
        { status: 400 }
      );
    }

    completeQuest(questId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error completing quest:', error);
    return NextResponse.json(
      { error: 'Failed to complete quest' },
      { status: 500 }
    );
  }
}