import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// In-memory storage for demo purposes (use a database in production)
const callLogs: unknown[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Post-call webhook received:', body);

    // Create call log entry
    const callLog = {
      id: `call_${Date.now()}`,
      bot_uid: body.bot_uid || 'unknown',
      bot_name: body.bot_name || 'Receptionist Bot',
      caller_number: body.caller_number || 'unknown',
      call_duration: body.duration || 0,
      transcript: body.transcript || '',
      status: body.status || 'completed',
      start_time: body.start_time || new Date().toISOString(),
      end_time: body.end_time || new Date().toISOString(),
      timestamp: new Date().toISOString(),
      metadata: {
        call_quality: body.call_quality || 'good',
        user_satisfaction: body.user_satisfaction || 'satisfied',
        purpose_fulfilled: true,
        follow_up_required: false,
        ...body.metadata
      }
    };

    // Store call log
    callLogs.push(callLog);

    // Also save to file for persistence (optional)
    try {
      const logsDir = path.join(process.cwd(), 'logs');
      if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
      }
      
      const logFile = path.join(logsDir, 'call-logs.json');
      fs.writeFileSync(logFile, JSON.stringify(callLogs, null, 2));
    } catch (fileError) {
      console.error('Error saving to file:', fileError);
    }

    console.log('Call log stored:', callLog);

    return NextResponse.json({
      success: true,
      message: 'Call log recorded successfully',
      call_id: callLog.id,
      timestamp: callLog.timestamp
    });
  } catch (error) {
    console.error('Post-call webhook error:', error);
    return NextResponse.json(
      { error: 'Post-call webhook failed' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return all call logs
  try {
    // Try to load from file first
    const logsDir = path.join(process.cwd(), 'logs');
    const logFile = path.join(logsDir, 'call-logs.json');
    
    if (fs.existsSync(logFile)) {
      const fileData = fs.readFileSync(logFile, 'utf-8');
      const fileLogs = JSON.parse(fileData);
      return NextResponse.json(fileLogs);
    }
  } catch (error) {
    console.error('Error reading log file:', error);
  }

  return NextResponse.json(callLogs);
}
