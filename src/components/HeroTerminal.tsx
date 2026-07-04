import { useCallback, useEffect, useRef, useState } from 'react'

const ROLES = [
  'Software Engineer',
  'Full-Stack Engineer',
  'Machine Learning Engineer',
  'Cloud Engineer',
  'AI Engineer',
]

function useCyclingRole() {
  const [roleIndex, setRoleIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [phase, setPhase] = useState<'typing' | 'pausing' | 'erasing'>('typing')

  useEffect(() => {
    const currentRole = ROLES[roleIndex]

    if (phase === 'typing') {
      if (displayed.length < currentRole.length) {
        const t = setTimeout(() => setDisplayed(currentRole.slice(0, displayed.length + 1)), 55)
        return () => clearTimeout(t)
      } else {
        const t = setTimeout(() => setPhase('pausing'), 1600)
        return () => clearTimeout(t)
      }
    }

    if (phase === 'pausing') {
      const t = setTimeout(() => setPhase('erasing'), 0)
      return () => clearTimeout(t)
    }

    if (phase === 'erasing') {
      if (displayed.length > 0) {
        const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 30)
        return () => clearTimeout(t)
      } else {
        setRoleIndex((i) => (i + 1) % ROLES.length)
        setPhase('typing')
      }
    }
  }, [phase, displayed, roleIndex])

  return displayed
}

function useTerminalMeshCanvas(active: boolean) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0.5, y: 0.5 })
  const animRef = useRef(0)

  const setMouse = useCallback((x: number, y: number) => {
    mouseRef.current = { x, y }
  }, [])

  useEffect(() => {
    if (!active) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let t = 0

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const blobs = [
      { x: 0.18, y: 0.28, r: 0.42, color: 'rgba(74,222,128,0.14)', speed: 0.0007, ox: 0.11, oy: 0.08 },
      { x: 0.78, y: 0.62, r: 0.36, color: 'rgba(59,130,246,0.1)', speed: 0.0009, ox: 0.1, oy: 0.11 },
      { x: 0.52, y: 0.14, r: 0.32, color: 'rgba(74,222,128,0.08)', speed: 0.0006, ox: 0.14, oy: 0.05 },
      { x: 0.12, y: 0.72, r: 0.34, color: 'rgba(45,212,191,0.07)', speed: 0.0008, ox: 0.09, oy: 0.12 },
    ]

    const draw = () => {
      const w = canvas.width
      const h = canvas.height
      t += 1

      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = '#0a0a0c'
      ctx.fillRect(0, 0, w, h)

      blobs.forEach((blob) => {
        const mx = mouseRef.current.x
        const my = mouseRef.current.y
        const bx =
          (blob.x +
            Math.sin(t * blob.speed * 1000 + blob.oy * 10) * blob.ox +
            (mx - blob.x) * 0.08) *
          w
        const by =
          (blob.y +
            Math.cos(t * blob.speed * 1000 + blob.ox * 10) * blob.oy +
            (my - blob.y) * 0.08) *
          h
        const radius = blob.r * Math.min(w, h)

        const grad = ctx.createRadialGradient(bx, by, 0, bx, by, radius)
        grad.addColorStop(0, blob.color)
        grad.addColorStop(1, 'rgba(0,0,0,0)')

        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(bx, by, radius, 0, Math.PI * 2)
        ctx.fill()
      })

      const sx = mouseRef.current.x * w
      const sy = mouseRef.current.y * h
      const spot = ctx.createRadialGradient(sx, sy, 0, sx, sy, Math.min(w, h) * 0.35)
      spot.addColorStop(0, 'rgba(74,222,128,0.12)')
      spot.addColorStop(0.45, 'rgba(74,222,128,0.04)')
      spot.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = spot
      ctx.fillRect(0, 0, w, h)

      ctx.strokeStyle = 'rgba(255,255,255,0.022)'
      ctx.lineWidth = 0.5
      const gridSize = 48
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, h)
        ctx.stroke()
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(w, y)
        ctx.stroke()
      }

      animRef.current = requestAnimationFrame(draw)
    }

    animRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [active])

  return { canvasRef, setMouse }
}

function StatusBox() {
  return (
    <div className="inline-flex items-stretch text-[11px] md:text-[12px] tracking-[0.08em] uppercase select-none">
      <span className="border border-[#2a2a2e] bg-[#101014] px-2 py-1.5 text-[#555]">status</span>
      <span className="border-y border-r border-[#2a2a2e] bg-[#0c0c0f] px-2.5 py-1.5 text-[#7a7a7a]">open to internships</span>
      <span className="border-y border-r border-[#2a2a2e] bg-[#0f0f12] px-2.5 py-1.5 text-[#555]">summer 2027</span>
    </div>
  )
}

export default function HeroTerminal() {
  const role = useCyclingRole()
  const [visible, setVisible] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [pointer, setPointer] = useState({ x: 0.5, y: 0.5 })
  const { canvasRef, setMouse } = useTerminalMeshCanvas(hovering)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 150)
    return () => clearTimeout(t)
  }, [])

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const rect = event.currentTarget.getBoundingClientRect()
      const x = (event.clientX - rect.left) / rect.width
      const y = (event.clientY - rect.top) / rect.height
      setPointer({ x, y })
      setMouse(x, y)
    },
    [setMouse],
  )

  const tiltX = hovering ? (pointer.y - 0.5) * -8 : 0
  const tiltY = hovering ? (pointer.x - 0.5) * 10 : 0
  const glowX = pointer.x * 100
  const glowY = pointer.y * 100

  return (
    <>
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>

      <div
        className="w-full h-full [perspective:1200px]"
        onPointerEnter={() => setHovering(true)}
        onPointerLeave={() => {
          setHovering(false)
          setPointer({ x: 0.5, y: 0.5 })
          setMouse(0.5, 0.5)
        }}
        onPointerMove={handlePointerMove}
      >
        <div
          className={`relative w-full h-full rounded-2xl transition-[transform,box-shadow] duration-300 ease-out ${
            hovering ? 'will-change-transform' : ''
          }`}
          style={{
            transform: hovering
              ? `rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.012)`
              : 'none',
            boxShadow: hovering
              ? `${tiltY * -1.5}px ${12 + tiltX * -0.5}px 48px rgba(0,0,0,0.55), 0 0 0 1px rgba(74,222,128,0.08), 0 0 ${32 + Math.abs(tiltY) * 2}px rgba(74,222,128,0.06)`
              : '0 18px 40px rgba(0,0,0,0.45)',
          }}
        >
          <div
            className={`relative rounded-2xl border-2 overflow-hidden w-full h-full flex flex-col transition-colors duration-300 ${
              hovering ? 'border-[#2f2f32] bg-[#0c0c0e]' : 'border-[#262628] bg-[#0b0b0d]'
            }`}
          >
            <div
              className="pointer-events-none absolute inset-0 z-[1] transition-opacity duration-300"
              style={{
                opacity: hovering ? 1 : 0,
                background: `radial-gradient(420px circle at ${glowX}% ${glowY}%, rgba(74,222,128,0.09), transparent 55%)`,
              }}
            />

            <div
              className={`flex items-center gap-2.5 px-6 md:px-7 py-4 md:py-[1.125rem] border-b shrink-0 relative z-[2] transition-colors duration-300 ${
                hovering ? 'border-[#232326] bg-[#0f0f13]' : 'border-[#1f1f22] bg-[#0d0d0f]'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-[#ff5f57] transition-shadow duration-300 ${
                  hovering ? 'shadow-[0_0_8px_rgba(255,95,87,0.45)]' : ''
                }`}
              />
              <div
                className={`w-4 h-4 rounded-full bg-[#febc2e] transition-shadow duration-300 ${
                  hovering ? 'shadow-[0_0_8px_rgba(254,188,46,0.35)]' : ''
                }`}
              />
              <div
                className={`w-4 h-4 rounded-full bg-[#28c840] transition-shadow duration-300 ${
                  hovering ? 'shadow-[0_0_8px_rgba(40,200,64,0.35)]' : ''
                }`}
              />
              <span className="ml-3 md:ml-4 text-[13px] md:text-[14px] text-[#454545] font-mono tracking-wider select-none">
                shakoor@portfolio ~ zsh
              </span>
            </div>

            <div className="relative flex-1 flex flex-col justify-center px-7 md:px-9 lg:px-10 py-8 md:py-10 overflow-hidden bg-[#0b0b0d]">
              <canvas
                ref={canvasRef}
                className={`absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-300 ${
                  hovering ? 'opacity-100' : 'opacity-0'
                }`}
                aria-hidden="true"
              />

              {visible && (
                <div className="relative z-[2] space-y-4 md:space-y-[1.125rem] font-mono text-[15.5px] md:text-[16.5px] lg:text-[17px] leading-[1.72] md:leading-[1.76]">
                  <div className="flex items-center gap-3">
                    <span className="text-[#3d5066] select-none shrink-0">$</span>
                    <span className="text-[#c9d1d9]">whoami</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[#4ade80] opacity-50 select-none shrink-0">&gt;</span>
                    <span className="text-[#4ade80]">
                      Shakoor Shaik{' '}
                      <span className="text-[#4ade80] opacity-60">—</span>{' '}
                      <span className="text-white font-medium">{role}</span>
                      <span
                        className="inline-block w-[9px] h-[1.125em] min-h-[17px] bg-white ml-[3px] align-middle rounded-[2px]"
                        style={{ animation: 'blink 1s step-end infinite' }}
                      />
                    </span>
                  </div>

                  <div className="h-2" />

                  <div className="flex items-center gap-3">
                    <span className="text-[#3d5066] select-none shrink-0">$</span>
                    <span className="text-[#c9d1d9]">cat stack.txt</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[#4ade80] opacity-50 select-none shrink-0">&gt;</span>
                    <span className="text-[#4ade80]">React · Python · Java · Node.js · ML</span>
                  </div>

                  <div className="h-2" />

                  <div className="flex items-center gap-3">
                    <span className="text-[#3d5066] select-none shrink-0">$</span>
                    <span className="text-[#c9d1d9]">cat status.txt</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-[#4ade80] opacity-50 select-none shrink-0 mt-1.5">&gt;</span>
                    <StatusBox />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
