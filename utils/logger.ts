// utils/logger.ts
'use client';

class DebugLogger {
  private logs: string[] = [];
  private readonly maxLogs = 1000;

  log(message: string, data?: any) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}${data ? ' | ' + JSON.stringify(data) : ''}`;
    
    this.logs.push(logMessage);
    
    // Mantener solo los últimos maxLogs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
    
    console.log(logMessage);
    this.saveToStorage();
  }

  private saveToStorage() {
    try {
      localStorage.setItem('debug_logs', JSON.stringify(this.logs));
    } catch (error) {
      console.warn('No se pudo guardar en localStorage');
    }
  }

  // Método para crear archivo físico
  createFile() {
    const logContent = this.logs.join('\n');
    const blob = new Blob([logContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `debug_logs_${new Date().toISOString().replace(/[:.]/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  clearLogs() {
    this.logs = [];
    localStorage.removeItem('debug_logs');
  }

  getLogs() {
    return this.logs;
  }
}

export const logger = new DebugLogger();