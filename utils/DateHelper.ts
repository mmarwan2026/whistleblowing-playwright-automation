export class DateHelper {
  static today() {
    return new Date().toISOString().slice(0, 10);
  }
}
