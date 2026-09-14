export class EnvironmentHelper {
  static required(name: string) {
    const value = process.env[name];
    if (!value) throw new Error(`${name} is required.`);
    return value;
  }
}
