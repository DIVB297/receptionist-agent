# Receptionist AI Agent - OpenMic Integration

A domain-specific AI intake agent for receptionist services built with Next.js, TypeScript, and Tailwind CSS, integrated with the OpenMic API for voice-based conversations.

## 🚀 Features

- **Bot Management**: Create, update, delete, and list AI receptionist bots
- **Call Logging**: View and track all call history with detailed transcripts
- **Webhook Integration**: 
  - Pre-call webhook for visitor information
  - Post-call webhook for call logging
  - Function call API for employee lookup
- **Professional UI**: Modern, responsive design with Tailwind CSS
- **TypeScript**: Fully typed for better development experience

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **API**: Next.js API Routes
- **HTTP Client**: Axios
- **Date Handling**: date-fns

## 📋 Prerequisites

Before you begin, ensure you have:

1. Node.js 18+ installed
2. An OpenMic account ([Sign up here](https://chat.openmic.ai/signup))
3. OpenMic API key ([Get it here](http://chat.openmic.ai/api-key-demo-735023852))
4. ngrok installed globally (`npm install -g ngrok`)

## ⚡ Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd receptionist-agent
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```env
OPENMIC_API_KEY=your_openmic_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_WEBHOOK_BASE_URL=https://your-ngrok-url.ngrok-free.app
```

### 3. Run the Application

```bash
# Start the development server
npm run dev

# In another terminal, expose the app with ngrok
ngrok http 3000
```

### 4. Configure Webhooks

Update your `.env.local` with your ngrok URL and use these endpoints in OpenMic:

- **Pre-call webhook**: `https://your-ngrok-url.ngrok-free.app/api/webhooks/pre-call`
- **Post-call webhook**: `https://your-ngrok-url.ngrok-free.app/api/webhooks/post-call`
- **Function call**: `https://your-ngrok-url.ngrok-free.app/api/functions/employee-lookup`

## 📱 Usage Guide

### Creating a Receptionist Bot

1. Navigate to the "Bot Management" tab
2. Click "Create Bot"
3. Fill in the bot details (the receptionist prompt is pre-filled)
4. Submit to create your bot
5. Copy the bot UID for OpenMic dashboard configuration

### Configuring OpenMic Dashboard

1. Go to [OpenMic Dashboard](https://chat.openmic.ai/)
2. Find your created bot
3. Configure webhooks:
   - **Pre-call URL**: Your ngrok URL + `/api/webhooks/pre-call`
   - **Post-call URL**: Your ngrok URL + `/api/webhooks/post-call`
4. Add custom function:
   - **Function name**: `employee-lookup`
   - **Endpoint**: Your ngrok URL + `/api/functions/employee-lookup`
   - **Parameters**: `employee_name` (string)

### Testing the Bot

1. Use the "Test Call" feature in OpenMic dashboard
2. The bot will introduce itself as a receptionist
3. Ask for an employee (try "Sarah Johnson", "Lisa Chen", etc.)
4. The bot will use the function call to get employee details
5. Check the "Call Logs" tab to see recorded conversations

## 🏢 Sample Employee Directory

The system includes these sample employees for testing:

| Name | Department | Location | Extension | Status |
|------|------------|----------|-----------|---------|
| Sarah Johnson | Sales | Floor 2, Room 201 | 2201 | Available |
| Lisa Chen | HR | Floor 1, Room 105 | 1105 | Available |
| David Martinez | Marketing | Floor 2, Room 225 | 2225 | Available |
| Robert Wilson | Engineering | Floor 3, Room 315 | 3315 | Unavailable |
| Jennifer Taylor | Finance | Floor 1, Room 120 | 1120 | Unavailable |

## 🔧 API Endpoints

### Bot Management
- `GET /api/bots` - List all bots
- `POST /api/bots` - Create a new bot
- `GET /api/bots/[uid]` - Get bot details
- `PATCH /api/bots/[uid]` - Update bot
- `DELETE /api/bots/[uid]` - Delete bot

### Webhooks
- `POST /api/webhooks/pre-call` - Pre-call webhook
- `POST /api/webhooks/post-call` - Post-call webhook
- `GET /api/webhooks/post-call` - Get call logs

### Functions
- `POST /api/functions/employee-lookup` - Employee lookup function

### Call Logs
- `GET /api/calls` - Get OpenMic call logs

## 🎯 Receptionist Bot Behavior

The AI receptionist is designed to:

1. **Greet professionally** and introduce itself
2. **Ask for employee name** the caller wishes to visit
3. **Use function calls** to lookup employee information
4. **Provide detailed info** about employee location and availability
5. **Handle queries courteously** and efficiently

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms

The app can be deployed to any Node.js hosting service:
- Netlify
- Railway
- Heroku
- DigitalOcean App Platform

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENMIC_API_KEY` | Your OpenMic API key | Yes |
| `NEXT_PUBLIC_APP_URL` | Base URL of your app | Yes |
| `NEXT_PUBLIC_WEBHOOK_BASE_URL` | Webhook base URL (ngrok/deployed) | Yes |

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── bots/                 # Bot management endpoints
│   │   ├── calls/                # Call logs endpoint  
│   │   ├── functions/
│   │   │   └── employee-lookup/  # Employee lookup function
│   │   └── webhooks/
│   │       ├── pre-call/         # Pre-call webhook
│   │       └── post-call/        # Post-call webhook
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                  # Main UI page
├── components/
│   ├── BotManagement.tsx         # Bot CRUD interface
│   └── CallLogs.tsx              # Call history display
├── lib/
│   ├── data.ts                   # Sample data and constants
│   └── openmic.ts                # OpenMic API client
└── types/
    └── index.ts                  # TypeScript type definitions
```

## 🐛 Troubleshooting

### Bot Creation Issues
- Verify your OpenMic API key is correct
- Check network connectivity
- Ensure API key has proper permissions

### Webhook Not Receiving Data
- Confirm ngrok is running and accessible
- Check that webhook URLs are correctly configured in OpenMic
- Verify the URLs don't have trailing slashes

### Function Calls Not Working
- Ensure the function endpoint is publicly accessible
- Check that the function name matches exactly
- Verify parameter names and types

## 📚 Resources

- [OpenMic API Documentation](https://docs.openmic.ai/)
- [OpenMic Dashboard](https://chat.openmic.ai/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## ✨ Demo

For a complete demo, refer to the setup guide in the application's "Setup Guide" tab, which provides step-by-step instructions for testing the receptionist bot functionality.
