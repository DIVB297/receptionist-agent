'use client';

import { useState } from 'react';
import BotManagement from '@/components/BotManagement';
import CallLogs from '@/components/CallLogs';
import { Bot, MessageSquare, Settings, ExternalLink } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'bots' | 'logs' | 'setup'>('bots');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm border mb-8">
        <div className="flex">
          <button
            onClick={() => setActiveTab('bots')}
            className={`flex-1 px-6 py-4 text-sm font-medium border-b-2 ${
              activeTab === 'bots'
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Bot className="w-4 h-4" />
              Bot Management
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('logs')}
            className={`flex-1 px-6 py-4 text-sm font-medium border-b-2 ${
              activeTab === 'logs'
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Call Logs
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('setup')}
            className={`flex-1 px-6 py-4 text-sm font-medium border-b-2 ${
              activeTab === 'setup'
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Settings className="w-4 h-4" />
              Setup Guide
            </div>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[600px]">
        {activeTab === 'bots' && <BotManagement />}
        {activeTab === 'logs' && <CallLogs />}
        {activeTab === 'setup' && <SetupGuide />}
      </div>
    </div>
  );
}

function SetupGuide() {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Receptionist AI Agent Setup Guide</h2>
        
        <div className="space-y-6">
          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">1. OpenMic API Configuration</h3>
            <p className="text-gray-600 mb-3">
              First, you need to configure your OpenMic API key and set up webhook URLs using ngrok.
            </p>
            <div className="bg-gray-50 rounded p-3 text-sm">
              <p className="font-mono text-gray-700">OPENMIC_API_KEY=your_api_key_here</p>
            </div>
          </div>

          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">2. Ngrok Setup for Webhooks</h3>
            <p className="text-gray-600 mb-3">
              Install and run ngrok to expose your local endpoints to OpenMic:
            </p>
            <div className="bg-gray-50 rounded p-3 text-sm space-y-2">
              <p className="font-mono text-gray-700"># Install ngrok (if not already installed)</p>
              <p className="font-mono text-gray-700">npm install -g ngrok</p>
              <p className="font-mono text-gray-700"># Run your Next.js app</p>
              <p className="font-mono text-gray-700">npm run dev</p>
              <p className="font-mono text-gray-700"># In another terminal, expose port 3000</p>
              <p className="font-mono text-gray-700">ngrok http 3000</p>
            </div>
          </div>

          <div className="border-l-4 border-purple-500 pl-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">3. Webhook URLs Configuration</h3>
            <p className="text-gray-600 mb-3">
              Use these endpoints in your OpenMic bot configuration (replace YOUR_NGROK_URL):
            </p>
            <div className="bg-gray-50 rounded p-3 text-sm space-y-2">
              <div>
                <p className="font-medium text-gray-700">Pre-call webhook:</p>
                <p className="font-mono text-blue-600">https://YOUR_NGROK_URL.ngrok-free.app/api/webhooks/pre-call</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Post-call webhook:</p>
                <p className="font-mono text-blue-600">https://YOUR_NGROK_URL.ngrok-free.app/api/webhooks/post-call</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Function call endpoint:</p>
                <p className="font-mono text-blue-600">https://YOUR_NGROK_URL.ngrok-free.app/api/functions/employee-lookup</p>
              </div>
            </div>
          </div>

          <div className="border-l-4 border-orange-500 pl-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">4. Bot Configuration in OpenMic Dashboard</h3>
            <p className="text-gray-600 mb-3">
              Since OpenMic doesn&apos;t provide public API endpoints for bot management, you&apos;ll need to manually create and configure bots in the OpenMic dashboard. Use the bot details from this UI as a reference:
            </p>
            <ol className="list-decimal list-inside text-gray-600 space-y-1">
              <li>Go to the OpenMic dashboard and create a new agent/bot</li>
              <li>Copy the name, description, and prompt from the bots you created in this UI</li>
              <li>Set the pre-call and post-call webhook URLs</li>
              <li>Add the employee-lookup function as a custom function</li>
              <li>Configure function parameters: employee_name (string)</li>
              <li>Copy the bot UID from OpenMic dashboard for your records</li>
              <li>Test the bot using the &quot;Test Call&quot; feature</li>
            </ol>
          </div>

          <div className="border-l-4 border-red-500 pl-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">5. Testing Your Receptionist Bot</h3>
            <p className="text-gray-600 mb-3">
              Test the complete flow:
            </p>
            <ol className="list-decimal list-inside text-gray-600 space-y-1">
              <li>Create a bot using the &quot;Bot Management&quot; tab</li>
              <li>Configure webhooks in OpenMic dashboard</li>
              <li>Use &quot;Test Call&quot; in OpenMic dashboard</li>
              <li>Ask for an employee (try &quot;Sarah Johnson&quot; or &quot;Lisa Chen&quot;)</li>
              <li>Check the &quot;Call Logs&quot; tab for recorded conversations</li>
            </ol>
          </div>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Quick Links</h4>
          <div className="space-y-2">
            <a
              href="https://docs.openmic.ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
            >
              <ExternalLink className="w-4 h-4" />
              OpenMic API Documentation
            </a>
            <a
              href="https://chat.openmic.ai/signup"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
            >
              <ExternalLink className="w-4 h-4" />
              OpenMic Signup
            </a>
            <a
              href="http://chat.openmic.ai/api-key-demo-735023852"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
            >
              <ExternalLink className="w-4 h-4" />
              Get API Key
            </a>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Sample Employee Directory</h3>
        <p className="text-gray-600 mb-4">
          These employees are available in the system for testing the employee lookup function:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded p-3">
            <h4 className="font-medium">Sarah Johnson</h4>
            <p className="text-sm text-gray-600">Sales • Floor 2, Room 201 • Ext. 2201</p>
          </div>
          <div className="border rounded p-3">
            <h4 className="font-medium">Lisa Chen</h4>
            <p className="text-sm text-gray-600">HR • Floor 1, Room 105 • Ext. 1105</p>
          </div>
          <div className="border rounded p-3">
            <h4 className="font-medium">David Martinez</h4>
            <p className="text-sm text-gray-600">Marketing • Floor 2, Room 225 • Ext. 2225</p>
          </div>
          <div className="border rounded p-3">
            <h4 className="font-medium">Robert Wilson</h4>
            <p className="text-sm text-gray-600">Engineering • Floor 3, Room 315 • Ext. 3315 (Unavailable)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
