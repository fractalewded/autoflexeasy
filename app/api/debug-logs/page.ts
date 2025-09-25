// app/debug-logs/page.tsx
'use client';
import { useState, useEffect } from 'react';

export default function DebugLogs() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/debug-logs')
      .then(res => res.json())
      .then(data => setLogs(data.logs || []));
  }, []);

  const downloadLogs = () => {
    const logContent = logs.map(log => 
      `[${log.timestamp}] ${log.message} ${log.data ? JSON.stringify(log.data) : ''}`
    ).join('\n');
    
    const blob = new Blob([logContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'middleware_logs.txt';
    a.click();
  };

  return (
    <div className="p-4">
      <h1>Debug Logs</h1>
      <button onClick={downloadLogs} className="bg-blue-500 text-white p-2 rounded">
        Descargar Logs
      </button>
      <pre>{JSON.stringify(logs, null, 2)}</pre>
    </div>
  );
}