import type Lenis from 'lenis'

/* Singleton handle to the Lenis instance created in Layout, so any component
   (back-to-top, nav, etc.) can trigger a smooth programmatic scroll. */
let instance: Lenis | null = null

export function setLenis(lenis: Lenis | null) {
  instance = lenis
}

export function getLenis() {
  return instance
}
