export class MMKV {
  private data: Map<string, string> = new Map();

  set(key: string, value: string): void {
    this.data.set(key, value);
  }

  getString(key: string): string | undefined {
    return this.data.get(key);
  }

  delete(key: string): void {
    this.data.delete(key);
  }

  clearAll(): void {
    this.data.clear();
  }

  getAllKeys(): string[] {
    return Array.from(this.data.keys());
  }

  contains(key: string): boolean {
    return this.data.has(key);
  }
}