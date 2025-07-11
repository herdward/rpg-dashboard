import { NextRequest, NextResponse } from 'next/server';
import { undoQuestCompletion } from '@/lib/xpUtils';

export async function POST(request: NextRequest) {
  try {
    const { questId } = await request.json();
    
    if (!questId) {
      return NextResponse.json(
        { error: 'Quest ID is required' },
        { status: 400 }
      );
    }

    undoQuestCompletion(questId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error undoing quest completion:', error);
    return NextResponse.json(
      { error: 'Failed to undo quest completion' },
      { status: 500 }
    );
  }
}