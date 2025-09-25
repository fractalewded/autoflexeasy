// utils/logger.ts
'use client';

class DebugLogger {
  private logs: string[] = [];
  private readonly maxLogs = 1000; // Máximo de logs en memoria

  log(message: string, data?: any) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}${data ? ' | ' + JSON.stringify(data, null, 2) : ''}`;
    
    this.logs.push(logMessage);
    
    // Mantener solo los últimos maxLogs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
    
    // También mostrar en consola para debugging inmediato
    console.log(logMessage);
    
    // Guardar en localStorage como backup
    this.saveToStorage();
  }

  private saveToStorage() {
    try {
      localStorage.setItem('debug_logs', JSON.stringify(this.logs));
    } catch (error) {
      console.warn('No se pudo guardar en localStorage:', error);
    }
  }

  downloadLogs() {
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