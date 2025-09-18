import { NextRequest, NextResponse } from 'next/server';
import OpenMicClient from '@/lib/openmic';

const openmic = new OpenMicClient(process.env.OPENMIC_API_KEY || '');

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const botUid = searchParams.get('bot_uid');
    
    const callLogs = await openmic.getCallLogs(botUid || undefined);
    return NextResponse.json(callLogs);
  } catch (error) {
    console.error('Error fetching call logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch call logs' },
      { status: 500 }
    );
  }
}
