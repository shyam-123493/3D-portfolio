import '@testing-library/jest-dom/vitest'

/* jsdom lacks the browser observer/media APIs that framer-motion and the
   custom cursor rely on — stub them so components mount in tests. */

class ObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() { return [] }
  root = null
  rootMargin = ''
  thresholds = []
}

if (typeof globalThis.IntersectionObserver === 'undefined') {
  globalThis.IntersectionObserver = ObserverStub as unknown as typeof IntersectionObserver
}

if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = ObserverStub as unknown as typeof ResizeObserver
}

if (typeof window !== 'undefined' && typeof window.matchMedia === 'undefined') {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList
}
