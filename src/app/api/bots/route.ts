import { NextRequest, NextResponse } from 'next/server';
import OpenMicClient from '@/lib/openmic';

const openmic = new OpenMicClient(process.env.OPENMIC_API_KEY || '');

export async function GET() {
  try {
    const bots = await openmic.getBots();
    return NextResponse.json(bots);
  } catch (error) {
    console.error('Error fetching bots:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bots' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const bot = await openmic.createBot(body);
    return NextResponse.json(bot, { status: 201 });
  } catch (error) {
    console.error('Error creating bot:', error);
    return NextResponse.json(
      { error: 'Failed to create bot' },
      { status: 500 }
    );
  }
}
