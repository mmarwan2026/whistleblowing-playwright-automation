import fs from 'node:fs/promises';

export class JsonHelper {
  static async read<T>(filePath: string): Promise<T> {
    return JSON.parse(await fs.readFile(filePath, 'utf8')) as T;
  }

  static async write(filePath: string, value: unknown) {
    await fs.writeFile(filePath, JSON.stringify(value, null, 2));
  }
}
