import { NextRequest, NextResponse } from 'next/server';
import { archiveQuest } from '@/lib/xpUtils';

export async function POST(request: NextRequest) {
  try {
    const { questId } = await request.json();
    
    if (!questId) {
      return NextResponse.json(
        { error: 'Quest ID is required' },
        { status: 400 }
      );
    }

    archiveQuest(questId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error archiving quest:', error);
    return NextResponse.json(
      { error: 'Failed to archive quest' },
      { status: 500 }
    );
  }
}