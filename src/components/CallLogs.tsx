'use client';

import { useState, useEffect } from 'react';
import { CallLog } from '@/types';
import { Phone, Clock, User, MessageSquare, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export default function CallLogs() {
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<CallLog | null>(null);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchCallLogs();
  }, []);

  const fetchCallLogs = async () => {
    try {
      // Fetch from both OpenMic API and our post-call webhook logs
      const [openmicResponse, webhookResponse] = await Promise.all([
        fetch('/api/calls').catch(() => null),
        fetch('/api/webhooks/post-call').catch(() => null)
      ]);

      let logs: unknown[] = [];

      if (openmicResponse && openmicResponse.ok) {
        const openmicData = await openmicResponse.json();
        logs = [...logs, ...openmicData];
      }

      if (webhookResponse && webhookResponse.ok) {
        const webhookData = await webhookResponse.json();
        logs = [...logs, ...webhookData];
      }

      // Remove duplicates and sort by timestamp
      const uniqueLogs = logs.filter((log, index, self) => 
        index === self.findIndex(l => (l as CallLog).id === (log as CallLog).id)
      ).sort((a, b) => {
        const timeA = new Date((a as CallLog).start_time || (a as CallLog & { timestamp?: string }).timestamp || new Date()).getTime();
        const timeB = new Date((b as CallLog).start_time || (b as CallLog & { timestamp?: string }).timestamp || new Date()).getTime();
        return timeB - timeA;
      });

      setCallLogs(uniqueLogs as CallLog[]);
    } catch (error) {
      console.error('Error fetching call logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = callLogs.filter(log => {
    if (filter === 'all') return true;
    return log.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Call History</h2>
        <div className="flex items-center gap-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Calls</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="in_progress">In Progress</option>
          </select>
          <button
            onClick={fetchCallLogs}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Phone className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {filteredLogs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border">
          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No call logs found</h3>
          <p className="text-gray-500">
            {filter === 'all' ? 'No calls have been logged yet' : `No ${filter} calls found`}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredLogs.map((log) => (
            <div key={log.id} className="bg-white rounded-lg shadow border p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-medium text-gray-900">
                      {log.bot_name || 'Receptionist Bot'}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(log.status)}`}>
                      {log.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{log.caller_number || 'Unknown'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{formatDuration(log.call_duration || 0)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {format(new Date((log as CallLog).start_time || (log as CallLog & { timestamp?: string }).timestamp || new Date()), 'MMM dd, HH:mm')}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      ID: {log.id}
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => setSelectedLog(selectedLog?.id === log.id ? null : log)}
                  className="ml-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  {selectedLog?.id === log.id ? 'Hide Details' : 'View Details'}
                </button>
              </div>

              {selectedLog?.id === log.id && (
                <div className="border-t pt-4 mt-4 space-y-4">
                  {log.transcript && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Transcript:</h4>
                      <div className="bg-gray-50 rounded p-3 text-sm text-gray-700 max-h-48 overflow-y-auto">
                        {log.transcript}
                      </div>
                    </div>
                  )}
                  
                  {log.metadata && Object.keys(log.metadata).length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Metadata:</h4>
                      <div className="bg-gray-50 rounded p-3 text-sm">
                        <pre className="text-gray-700 whitespace-pre-wrap">
                          {JSON.stringify(log.metadata, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Bot UID:</span>
                      <p className="text-gray-600">{log.bot_uid}</p>
                    </div>
                    {log.end_time && (
                      <div>
                        <span className="font-medium text-gray-700">End Time:</span>
                        <p className="text-gray-600">
                          {format(new Date(log.end_time), 'MMM dd, yyyy HH:mm:ss')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
