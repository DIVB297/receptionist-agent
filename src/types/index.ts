export interface Bot {
  uid: string;
  name: string;
  description: string;
  prompt: string;
  voice: string;
  created_at: string;
  updated_at: string;
  status: 'active' | 'inactive';
}

export interface CreateBotRequest {
  name: string;
  description: string;
  prompt: string;
  voice?: string;
}

export interface UpdateBotRequest {
  name?: string;
  description?: string;
  prompt?: string;
  voice?: string;
}

export interface CallLog {
  id: string;
  bot_uid: string;
  bot_name: string;
  caller_number: string;
  call_duration: number;
  transcript: string;
  status: string;
  start_time: string;
  end_time: string;
  metadata: Record<string, unknown>;
}

export interface VisitorInfo {
  id: string;
  name: string;
  company: string;
  purpose: string;
  expected_arrival: string;
  contact_number: string;
}

export interface EmployeeInfo {
  id: string;
  name: string;
  department: string;
  location: string;
  extension: string;
  available: boolean;
}

export interface PreCallWebhookData {
  visitor_info: VisitorInfo;
  timestamp: string;
}

export interface PostCallWebhookData {
  call_id: string;
  bot_uid: string;
  transcript: string;
  duration: number;
  caller_number: string;
  timestamp: string;
  metadata: Record<string, unknown>;
}

export interface FunctionCallRequest {
  employee_name?: string;
  parameters?: {
    employee_name?: string;
  };
  args?: string[];
  [key: string]: unknown; // Allow any additional properties
}

export interface FunctionCallResponse {
  success: boolean;
  employee_info?: EmployeeInfo;
  error?: string;
}
