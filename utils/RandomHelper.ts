export class RandomHelper {
  static text(prefix = 'qa') {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  }
}
