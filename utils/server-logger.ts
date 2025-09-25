// utils/server-logger.ts
import fs from 'fs';
import path from 'path';

class ServerLogger {
  private logFile: string;
  
  constructor() {
    // Crear directorio de logs si no existe
    const logDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    
    this.logFile = path.join(logDir, `middleware_debug_${new Date().toISOString().split('T')[0]}.txt`);
  }

  log(message: string, data?: any) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}${data ? ' | ' + JSON.stringify(data, null, 2) : ''}\n`;
    
    // Escribir en archivo
    fs.appendFileSync(this.logFile, logMessage, 'utf8');
    
    // También log en consola del servidor
    console.log(logMessage.trim());
  }

  getLogPath() {
    return this.logFile;
  }

  clearLogs() {
    if (fs.existsSync(this.logFile)) {
      fs.unlinkSync(this.logFile);
    }
  }
}

export const serverLogger = new ServerLogger();