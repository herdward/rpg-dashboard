import { NextRequest, NextResponse } from 'next/server';
import { addXPLog } from '@/lib/xpUtils';

export async function POST(request: NextRequest) {
  try {
    const { domain, task, xp } = await request.json();
    
    if (!domain || !task || !xp) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (typeof xp !== 'number' || xp <= 0) {
      return NextResponse.json(
        { error: 'XP must be a positive number' },
        { status: 400 }
      );
    }

    addXPLog({ domain, task, xp });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error adding XP log:', error);
    return NextResponse.json(
      { error: 'Failed to add XP log' },
      { status: 500 }
    );
  }
}