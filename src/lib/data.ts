import { VisitorInfo, EmployeeInfo } from '@/types';

export const sampleVisitors: VisitorInfo[] = [
  {
    id: 'V001',
    name: 'John Smith',
    company: 'ABC Technologies',
    purpose: 'Meeting with Sarah Johnson',
    expected_arrival: '2025-09-18T10:00:00Z',
    contact_number: '+1-555-0123',
  },
  {
    id: 'V002',
    name: 'Emily Davis',
    company: 'XYZ Corp',
    purpose: 'Product demonstration',
    expected_arrival: '2025-09-18T14:30:00Z',
    contact_number: '+1-555-0456',
  },
  {
    id: 'V003',
    name: 'Michael Brown',
    company: 'Tech Solutions Inc',
    purpose: 'Interview with HR',
    expected_arrival: '2025-09-18T11:15:00Z',
    contact_number: '+1-555-0789',
  },
];

export const sampleEmployees: EmployeeInfo[] = [
  {
    id: 'E001',
    name: 'Sarah Johnson',
    department: 'Sales',
    location: 'Floor 2, Room 201',
    extension: '2201',
    available: true,
  },
  {
    id: 'E002',
    name: 'Robert Wilson',
    department: 'Engineering',
    location: 'Floor 3, Room 315',
    extension: '3315',
    available: false,
  },
  {
    id: 'E003',
    name: 'Lisa Chen',
    department: 'HR',
    location: 'Floor 1, Room 105',
    extension: '1105',
    available: true,
  },
  {
    id: 'E004',
    name: 'David Martinez',
    department: 'Marketing',
    location: 'Floor 2, Room 225',
    extension: '2225',
    available: true,
  },
  {
    id: 'E005',
    name: 'Jennifer Taylor',
    department: 'Finance',
    location: 'Floor 1, Room 120',
    extension: '1120',
    available: false,
  },
];

export const getRandomVisitor = (): VisitorInfo => {
  const randomIndex = Math.floor(Math.random() * sampleVisitors.length);
  return sampleVisitors[randomIndex];
};

export const findEmployeeByName = (name: string): EmployeeInfo | null => {
  const employee = sampleEmployees.find(
    emp => emp.name.toLowerCase().includes(name.toLowerCase()) ||
           name.toLowerCase().includes(emp.name.toLowerCase())
  );
  return employee || null;
};

export const RECEPTIONIST_PROMPT = `You are a professional receptionist AI for TechCorp headquarters. Your role is to:

1. Greet callers professionally and introduce yourself
2. Ask for the employee name they wish to visit or meet
3. Use the provided function to look up employee information and location
4. Provide helpful information about the employee's location, department, and availability
5. Offer to connect them or provide directions
6. Handle calls courteously and efficiently

Key behaviors:
- Always be polite and professional
- Speak clearly and at a moderate pace
- Ask for clarification if you don't understand
- Provide complete information about employee location and department
- If an employee is not available, offer alternatives or suggest the best time to call back
- Thank callers for calling TechCorp

When you receive employee information from the function call, make sure to mention:
- The employee's full name
- Their department
- Their location (floor and room number)
- Their extension number
- Whether they are currently available

Keep responses concise but informative.`;

const dataModule = {
  sampleVisitors,
  sampleEmployees,
  getRandomVisitor,
  findEmployeeByName,
  RECEPTIONIST_PROMPT,
};

export default dataModule;
