import "@testing-library/jest-dom/vitest";

// Node.js v25+ exposes a built-in `localStorage` global that lacks setItem/getItem.
// This shadows jsdom's proper Web Storage implementation. We fix this by
// replacing it with a simple in-memory polyfill that satisfies zustand's persist middleware.
const store: Record<string, string> = {};

const storageMock: Storage = {
  getItem: (key: string) => store[key] ?? null,
  setItem: (key: string, value: string) => {
    store[key] = String(value);
  },
  removeItem: (key: string) => {
    delete store[key];
  },
  clear: () => {
    for (const key in store) {
      delete store[key];
    }
  },
  get length() {
    return Object.keys(store).length;
  },
  key: (index: number) => Object.keys(store)[index] ?? null,
};

Object.defineProperty(globalThis, "localStorage", {
  value: storageMock,
  writable: true,
  configurable: true,
});
