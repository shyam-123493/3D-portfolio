import { useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* Builds a GSAP timeline that plays once, the first time the canvas scrolls
   into view. ScrollTrigger is driven by the Lenis-synced GSAP ticker (wired
   in Layout), so the trigger fires on the smooth-scroll position. Use inside
   any Canvas — FrameDriver keeps invalidating frames while the canvas is
   visible, so tweens on three.js objects render even with frameloop="demand".

   The timeline and its ScrollTrigger are killed on unmount (or when a dep
   changes, e.g. async data arriving rebuilds the entrance with the full set
   of objects). */
export function useCanvasEnterTimeline(
  build: (tl: gsap.core.Timeline) => void,
  deps: React.DependencyList = [],
) {
  const { gl } = useThree()
  const buildRef = useRef(build)
  buildRef.current = build

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: gl.domElement,
        start: 'top 82%',
        once: true,
      },
    })
    buildRef.current(tl)
    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gl.domElement, ...deps])
}
