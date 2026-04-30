export async function register() {
  // Node.js 22+ exposes a native localStorage global via --localstorage-file.
  // When Next.js passes this flag without a valid path, localStorage exists but
  // its methods are broken. Patch it to a no-op safe implementation.
  if (
    typeof globalThis.localStorage !== 'undefined' &&
    typeof globalThis.localStorage.getItem !== 'function'
  ) {
    const safeStorage: Storage = {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
      key: () => null,
      length: 0,
    }
    Object.defineProperty(globalThis, 'localStorage', {
      value: safeStorage,
      writable: true,
      configurable: true,
    })
  }
}
