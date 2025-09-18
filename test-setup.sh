#!/bin/bash

echo "🤖 Testing Receptionist AI Agent Setup"
echo "======================================"
echo

# Test if the server is running
echo "1. Testing server connectivity..."
if curl -s http://localhost:3000/api/webhooks/pre-call > /dev/null; then
    echo "✅ Server is running on http://localhost:3000"
else
    echo "❌ Server is not running. Please run 'npm run dev' first."
    exit 1
fi

echo

# Test pre-call webhook
echo "2. Testing pre-call webhook..."
PRECALL_RESPONSE=$(curl -s http://localhost:3000/api/webhooks/pre-call)
echo "✅ Pre-call webhook: $PRECALL_RESPONSE"

echo

# Test post-call webhook with sample data
echo "3. Testing post-call webhook..."
POSTCALL_RESPONSE=$(curl -s -X POST http://localhost:3000/api/webhooks/post-call \
  -H "Content-Type: application/json" \
  -d '{
    "bot_uid": "test_bot_123",
    "bot_name": "Test Receptionist Bot",
    "caller_number": "+1234567890",
    "duration": 120,
    "transcript": "Test call transcript",
    "status": "completed"
  }')
echo "✅ Post-call webhook: $POSTCALL_RESPONSE"

echo

# Test employee lookup function
echo "4. Testing employee lookup function..."
echo "   Testing with existing employee (Sarah Johnson)..."
LOOKUP_SUCCESS=$(curl -s -X POST http://localhost:3000/api/functions/employee-lookup \
  -H "Content-Type: application/json" \
  -d '{"employee_name": "Sarah Johnson"}')
echo "✅ Lookup success: $LOOKUP_SUCCESS"

echo "   Testing with non-existent employee..."
LOOKUP_FAIL=$(curl -s -X POST http://localhost:3000/api/functions/employee-lookup \
  -H "Content-Type: application/json" \
  -d '{"employee_name": "John Doe"}')
echo "✅ Lookup failure: $LOOKUP_FAIL"

echo

# Check if ngrok is available
echo "5. Checking ngrok availability..."
if command -v ngrok &> /dev/null; then
    echo "✅ ngrok is installed"
    echo "   Run 'ngrok http 3000' in another terminal to expose your endpoints"
else
    echo "⚠️  ngrok is not installed. Install with: npm install -g ngrok"
fi

echo

# Display endpoint URLs
echo "📋 Your webhook endpoints:"
echo "   Pre-call:  http://localhost:3000/api/webhooks/pre-call"
echo "   Post-call: http://localhost:3000/api/webhooks/post-call"
echo "   Function:  http://localhost:3000/api/functions/employee-lookup"

echo

echo "🎉 All tests completed!"
echo "📚 Next steps:"
echo "   1. Run 'ngrok http 3000' to get public URLs"
echo "   2. Update your .env.local with the ngrok URL"
echo "   3. Configure these URLs in your OpenMic bot dashboard"
echo "   4. Test your bot using OpenMic's Test Call feature"
