import { useEffect, useState } from 'react'

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

export default function HeroTerminal() {
  const role = useCyclingRole()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 150)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>

      <div className="rounded-2xl border-2 border-[#2f2f32] bg-[#0c0c0e] overflow-hidden shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_28px_72px_rgba(0,0,0,0.62)] w-full h-full flex flex-col">

        {/* ── macOS title bar ── */}
        <div className="flex items-center gap-2.5 px-6 md:px-7 py-4 md:py-[1.125rem] border-b border-[#232326] bg-[#0f0f13] shrink-0">
          <div className="w-4 h-4 rounded-full bg-[#ff5f57] shadow-[0_0_8px_rgba(255,95,87,0.45)]" />
          <div className="w-4 h-4 rounded-full bg-[#febc2e] shadow-[0_0_8px_rgba(254,188,46,0.35)]" />
          <div className="w-4 h-4 rounded-full bg-[#28c840] shadow-[0_0_8px_rgba(40,200,64,0.35)]" />
          <span className="ml-3 md:ml-4 text-[13px] md:text-[14px] text-[#454545] font-mono tracking-wider select-none">
            shakoor@portfolio ~ zsh
          </span>
        </div>

        {/* ── Terminal body — flex-1 so it fills remaining height ── */}
        <div className="flex-1 flex flex-col justify-center px-7 md:px-9 lg:px-10 py-8 md:py-10">
          {visible && (
            <div className="space-y-4 md:space-y-[1.125rem] font-mono text-[15.5px] md:text-[16.5px] lg:text-[17px] leading-[1.72] md:leading-[1.76]">

              {/* whoami */}
              <div className="flex items-center gap-3">
                <span className="text-[#3d5066] select-none shrink-0">$</span>
                <span className="text-[#c9d1d9]">whoami</span>
              </div>

              {/* cycling role */}
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

              {/* spacer */}
              <div className="h-2" />

              {/* cat stack.txt */}
              <div className="flex items-center gap-3">
                <span className="text-[#3d5066] select-none shrink-0">$</span>
                <span className="text-[#c9d1d9]">cat stack.txt</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#4ade80] opacity-50 select-none shrink-0">&gt;</span>
                <span className="text-[#4ade80]">React · Python · Java · Node.js · ML</span>
              </div>

              {/* spacer */}
              <div className="h-2" />

              {/* cat status.txt */}
              <div className="flex items-center gap-3">
                <span className="text-[#3d5066] select-none shrink-0">$</span>
                <span className="text-[#c9d1d9]">cat status.txt</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#4ade80] opacity-50 select-none shrink-0">&gt;</span>
                <span className="text-[#4ade80]">Open to internships · Summer/Fall 2026</span>
              </div>

            </div>
          )}
        </div>
      </div>
    </>
  )
}