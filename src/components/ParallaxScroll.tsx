import { useEffect } from 'react'

const SMOOTHING = 0.082
const MAX_OFFSET = 140

type ParallaxTarget = {
  el: HTMLElement
  speed: number
  mode: 'viewport' | 'fixed'
}

function readTargets() {
  return Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]')).map((el) => ({
    el,
    speed: parseFloat(el.dataset.parallax || '0.1'),
    mode: el.dataset.parallaxMode === 'fixed' ? 'fixed' : 'viewport',
  })) satisfies ParallaxTarget[]
}

export default function ParallaxScroll() {
  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (motionQuery.matches) return

    let targets = readTargets()
    let scrollY = window.scrollY
    let smoothY = scrollY
    let raf = 0
    let running = true

    const scale = () => (window.innerWidth < 768 ? 0.45 : window.innerWidth < 1024 ? 0.72 : 1)

    const apply = () => {
      if (!running) return

      smoothY += (scrollY - smoothY) * SMOOTHING
      const viewportH = window.innerHeight
      const intensity = scale()

      targets.forEach(({ el, speed, mode }) => {
        const rate = speed * intensity

        if (mode === 'fixed') {
          const offset = smoothY * rate * -0.35
          el.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`
          return
        }

        const rect = el.getBoundingClientRect()
        const elementMid = rect.top + rect.height * 0.5
        const progress = (elementMid - viewportH * 0.5) / viewportH
        const offset = progress * rate * 100
        const clamped = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, offset))
        el.style.transform = `translate3d(0, ${clamped.toFixed(2)}px, 0)`
      })

      raf = requestAnimationFrame(apply)
    }

    const onScroll = () => {
      scrollY = window.scrollY
    }

    const onResize = () => {
      targets = readTargets()
    }

    const onMotionChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        running = false
        cancelAnimationFrame(raf)
        targets.forEach(({ el }) => {
          el.style.transform = ''
        })
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })
    motionQuery.addEventListener('change', onMotionChange)
    raf = requestAnimationFrame(apply)

    return () => {
      running = false
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      motionQuery.removeEventListener('change', onMotionChange)
      cancelAnimationFrame(raf)
      targets.forEach(({ el }) => {
        el.style.transform = ''
      })
    }
  }, [])

  return null
}
