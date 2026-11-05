export class MemoryStorage {
    values = new Map();
    getItem(key) { return this.values.get(key) ?? null; }
    setItem(key, value) { this.values.set(key, String(value)); }
    removeItem(key) { this.values.delete(key); }
    clear() { this.values.clear(); }
}
export function resetStorage() {
    globalThis.localStorage = new MemoryStorage();
    globalThis.sessionStorage = new MemoryStorage();
}
