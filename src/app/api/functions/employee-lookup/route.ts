import { NextRequest, NextResponse } from 'next/server';
import { findEmployeeByName } from '@/lib/data';
import { FunctionCallRequest, FunctionCallResponse } from '@/types';

export async function POST(request: NextRequest) {
  // Add CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  try {
    const body: FunctionCallRequest = await request.json();
    console.log('Function call received:', body);

    // Extract employee_name from different possible formats
    let employee_name = body.employee_name;
    
    // If body is empty, try to extract from other common formats
    if (!employee_name && body.parameters) {
      employee_name = body.parameters.employee_name;
    }
    
    // If still no name, try to extract from args array
    if (!employee_name && body.args && Array.isArray(body.args) && body.args.length > 0) {
      employee_name = body.args[0];
    }
    
    // If still no name, try to find any string value in the body
    if (!employee_name) {
      const values = Object.values(body).filter(val => typeof val === 'string' && val.trim().length > 0);
      if (values.length > 0) {
        employee_name = values[0] as string;
      }
    }

    if (!employee_name) {
      console.log('No employee name provided. Body:', body);
      return NextResponse.json({
        success: false,
        error: 'Employee name is required. Please provide the name of the employee you are looking for.'
      } as FunctionCallResponse, { status: 400, headers });
    }

    // Find employee by name
    const employee = findEmployeeByName(employee_name);

    if (!employee) {
      return NextResponse.json({
        success: false,
        error: `Employee "${employee_name}" not found in our directory. Please check the spelling or try with a different name.`
      } as FunctionCallResponse, { headers });
    }

    const response: FunctionCallResponse = {
      success: true,
      employee_info: employee
    };

    console.log('Function call response:', response);
    return NextResponse.json(response, { headers });
  } catch (error) {
    console.error('Function call error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    } as FunctionCallResponse, { status: 500, headers });
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return NextResponse.json({}, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function GET() {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  return NextResponse.json({
    message: 'Employee lookup function is active',
    description: 'POST with employee_name to lookup employee information',
    example: {
      employee_name: 'Sarah Johnson'
    },
    supported_formats: [
      { employee_name: 'Sarah Johnson' },
      { parameters: { employee_name: 'Sarah Johnson' } },
      { args: ['Sarah Johnson'] }
    ]
  }, { headers });
}
