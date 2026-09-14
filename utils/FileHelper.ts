import path from 'node:path';

export class FileHelper {
  static testFile(...parts: string[]) {
    return path.resolve(process.cwd(), 'test-files', ...parts);
  }
}
