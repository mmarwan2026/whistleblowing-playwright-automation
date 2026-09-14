export class TestDataCleaner {
  private readonly cleanupActions: Array<() => Promise<void>> = [];

  add(action: () => Promise<void>) {
    this.cleanupActions.push(action);
  }

  async run() {
    for (const action of this.cleanupActions.reverse()) {
      await action().catch(() => undefined);
    }
  }
}
