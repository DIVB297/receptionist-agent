'use client';

import { useState, useEffect } from 'react';
import { Bot, CreateBotRequest } from '@/types';
import { Plus, Edit, Trash2, Phone } from 'lucide-react';
import { RECEPTIONIST_PROMPT } from '@/lib/data';

export default function BotManagement() {
  const [bots, setBots] = useState<Bot[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingBot, setEditingBot] = useState<Bot | null>(null);
  const [formData, setFormData] = useState<CreateBotRequest>({
    name: '',
    description: '',
    prompt: RECEPTIONIST_PROMPT,
    voice: 'default',
  });

  useEffect(() => {
    fetchBots();
  }, []);

  const fetchBots = async () => {
    try {
      const response = await fetch('/api/bots');
      if (response.ok) {
        const data = await response.json();
        setBots(data);
      }
    } catch (error) {
      console.error('Error fetching bots:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBot = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/bots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newBot = await response.json();
        setBots([...bots, newBot]);
        setShowCreateForm(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error creating bot:', error);
    }
  };

  const handleUpdateBot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBot) return;

    try {
      const response = await fetch(`/api/bots/${editingBot.uid}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedBot = await response.json();
        setBots(bots.map(bot => bot.uid === editingBot.uid ? updatedBot : bot));
        setEditingBot(null);
        resetForm();
      }
    } catch (error) {
      console.error('Error updating bot:', error);
    }
  };

  const handleDeleteBot = async (uid: string) => {
    if (!confirm('Are you sure you want to delete this bot?')) return;

    try {
      const response = await fetch(`/api/bots/${uid}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setBots(bots.filter(bot => bot.uid !== uid));
      }
    } catch (error) {
      console.error('Error deleting bot:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      prompt: RECEPTIONIST_PROMPT,
      voice: 'default',
    });
  };

  const startEdit = (bot: Bot) => {
    setEditingBot(bot);
    setFormData({
      name: bot.name,
      description: bot.description,
      prompt: bot.prompt,
      voice: bot.voice,
    });
    setShowCreateForm(true);
  };

  const cancelEdit = () => {
    setEditingBot(null);
    setShowCreateForm(false);
    resetForm();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Demo Mode
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                This UI demonstrates bot management functionality. Bots created here are stored locally for demo purposes. 
                To use these bots with OpenMic, you&apos;ll need to manually configure them in the OpenMic dashboard with the same settings.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Bot Management</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Create Bot
        </button>
      </div>

      {showCreateForm && (
        <div className="bg-white rounded-lg shadow p-6 border">
          <h3 className="text-lg font-medium mb-4">
            {editingBot ? 'Edit Bot' : 'Create New Bot'}
          </h3>
          <form onSubmit={editingBot ? handleUpdateBot : handleCreateBot} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bot Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Voice
              </label>
              <select
                value={formData.voice}
                onChange={(e) => setFormData({ ...formData, voice: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="default">Default</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prompt
              </label>
              <textarea
                value={formData.prompt}
                onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                rows={8}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                {editingBot ? 'Update Bot' : 'Create Bot'}
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4">
        {bots.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border">
            <Phone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bots created yet</h3>
            <p className="text-gray-500">Create your first receptionist bot to get started</p>
          </div>
        ) : (
          bots.map((bot) => (
            <div key={bot.uid} className="bg-white rounded-lg shadow border p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{bot.name}</h3>
                  <p className="text-gray-600 mt-1">{bot.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span>UID: {bot.uid}</span>
                    <span>Voice: {bot.voice}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      bot.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {bot.status}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(bot)}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteBot(bot.uid)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Prompt Preview:</h4>
                <div className="bg-gray-50 rounded p-3 text-sm text-gray-600 max-h-32 overflow-y-auto">
                  {bot.prompt.substring(0, 200)}...
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
