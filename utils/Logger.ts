export class Logger {
  static info(message: string, data?: unknown) {
    console.log(`[INFO] ${message}`, data ?? '');
  }

  static error(message: string, data?: unknown) {
    console.error(`[ERROR] ${message}`, data ?? '');
  }
}
