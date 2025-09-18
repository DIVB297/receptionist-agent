import { NextRequest, NextResponse } from 'next/server';
import { getRandomVisitor } from '@/lib/data';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Pre-call webhook received:', body);

    // Get random visitor info for demonstration
    const visitor = getRandomVisitor();
    
    const preCallData = {
      visitor_info: visitor,
      timestamp: new Date().toISOString(),
      message: `Expecting visitor: ${visitor.name} from ${visitor.company}. Purpose: ${visitor.purpose}`,
      additional_context: {
        expected_arrival: visitor.expected_arrival,
        contact_number: visitor.contact_number,
        special_instructions: 'Please verify ID and provide visitor badge.'
      }
    };

    console.log('Pre-call response:', preCallData);
    
    return NextResponse.json(preCallData);
  } catch (error) {
    console.error('Pre-call webhook error:', error);
    return NextResponse.json(
      { error: 'Pre-call webhook failed' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Pre-call webhook endpoint is active',
    timestamp: new Date().toISOString() 
  });
}
