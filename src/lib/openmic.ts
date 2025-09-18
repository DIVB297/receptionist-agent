import axios from 'axios';
import { Bot, CreateBotRequest, UpdateBotRequest } from '@/types';

const OPENMIC_API_BASE = 'https://api.openmic.ai/v1';

class OpenMicClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private getHeaders() {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };
  }

  async createBot(botData: CreateBotRequest): Promise<Bot> {
    // Note: OpenMic API might not have public bot management endpoints
    // This is a mock implementation for demonstration purposes
    // In production, you would manage bots through the OpenMic dashboard
    const bot: Bot = {
      uid: `bot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: botData.name,
      description: botData.description,
      prompt: botData.prompt,
      voice: botData.voice || 'default',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: 'active'
    };
    
    // Store in localStorage for demo purposes
    this.storeBotLocally(bot);
    return bot;
  }

  async getBots(): Promise<Bot[]> {
    // Since OpenMic API doesn't seem to have public bot management endpoints,
    // we'll return locally stored bots for demonstration
    return this.getLocalBots();
  }

  async getBot(uid: string): Promise<Bot> {
    const bots = this.getLocalBots();
    const bot = bots.find(b => b.uid === uid);
    if (!bot) {
      throw new Error('Bot not found');
    }
    return bot;
  }

  async updateBot(uid: string, botData: UpdateBotRequest): Promise<Bot> {
    const bots = this.getLocalBots();
    const botIndex = bots.findIndex(b => b.uid === uid);
    
    if (botIndex === -1) {
      throw new Error('Bot not found');
    }

    const updatedBot = {
      ...bots[botIndex],
      ...botData,
      updated_at: new Date().toISOString()
    };

    bots[botIndex] = updatedBot;
    this.storeBotsLocally(bots);
    return updatedBot;
  }

  async deleteBot(uid: string): Promise<void> {
    const bots = this.getLocalBots();
    const filteredBots = bots.filter(b => b.uid !== uid);
    
    if (bots.length === filteredBots.length) {
      throw new Error('Bot not found');
    }
    
    this.storeBotsLocally(filteredBots);
  }

  async getCallLogs(botUid?: string): Promise<unknown[]> {
    try {
      // Try to get actual call logs from OpenMic API
      const params = botUid ? { agent_id: botUid } : {};
      const response = await axios.get(`${OPENMIC_API_BASE}/calls`, {
        headers: this.getHeaders(),
        params,
      });
      return response.data.calls || response.data || [];
    } catch (error) {
      console.log('OpenMic API call failed, returning empty logs:', error);
      return [];
    }
  }

  // Local storage helper methods for demo purposes
  private storeBotLocally(bot: Bot): void {
    if (typeof window !== 'undefined') {
      const existingBots = this.getLocalBots();
      const updatedBots = [...existingBots, bot];
      localStorage.setItem('openmic_bots', JSON.stringify(updatedBots));
    }
  }

  private getLocalBots(): Bot[] {
    if (typeof window === 'undefined') {
      return [];
    }
    
    const stored = localStorage.getItem('openmic_bots');
    return stored ? JSON.parse(stored) : [];
  }

  private storeBotsLocally(bots: Bot[]): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('openmic_bots', JSON.stringify(bots));
    }
  }

  async createPhoneCall(phoneNumber: string, botUid: string): Promise<unknown> {
    try {
      const response = await axios.post(`${OPENMIC_API_BASE}/create-phone-call`, {
        from_number: process.env.OPENMIC_PHONE_NUMBER || '+1234567890',
        to_number: phoneNumber,
        override_agent_id: botUid,
      }, {
        headers: this.getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error creating phone call:', error);
      throw error;
    }
  }
}

export default OpenMicClient;
