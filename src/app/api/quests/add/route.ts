import { NextRequest, NextResponse } from 'next/server';
import { addQuest } from '@/lib/xpUtils';

export async function POST(request: NextRequest) {
  try {
    const { domain, description, xp } = await request.json();
    
    if (!domain || !description || !xp) {
      return NextResponse.json(
        { error: 'Domain, description, and XP are required' },
        { status: 400 }
      );
    }

    if (typeof xp !== 'number' || xp <= 0) {
      return NextResponse.json(
        { error: 'XP must be a positive number' },
        { status: 400 }
      );
    }

    addQuest({ domain, description, xp });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error adding quest:', error);
    return NextResponse.json(
      { error: 'Failed to add quest' },
      { status: 500 }
    );
  }
}