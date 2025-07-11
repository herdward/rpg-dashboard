import { NextRequest, NextResponse } from 'next/server';
import { unarchiveQuest } from '@/lib/xpUtils';

export async function POST(request: NextRequest) {
  try {
    const { questId } = await request.json();
    
    if (!questId) {
      return NextResponse.json(
        { error: 'Quest ID is required' },
        { status: 400 }
      );
    }

    unarchiveQuest(questId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error unarchiving quest:', error);
    return NextResponse.json(
      { error: 'Failed to unarchive quest' },
      { status: 500 }
    );
  }
}