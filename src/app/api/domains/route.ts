import { NextResponse } from 'next/server';
import { getAllDomains } from '@/lib/xpUtils';

export async function GET() {
  try {
    const domains = getAllDomains();
    return NextResponse.json(domains);
  } catch (error) {
    console.error('Error fetching domains:', error);
    return NextResponse.json(
      { error: 'Failed to fetch domains' },
      { status: 500 }
    );
  }
}