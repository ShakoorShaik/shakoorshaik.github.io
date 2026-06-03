import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import type { Experience } from '../data/portfolio'

type Props = {
  experiences: Experience[]
}

function ExperienceModal({ experience, onClose }: { experience: Experience | null; onClose: () => void }) {
  useEffect(() => {
    if (!experience) return

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    const previousBodyOverflow = document.body.style.overflow

    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousBodyOverflow
    }
  }, [experience, onClose])

  if (!experience) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[min(92vw,680px)] rounded-2xl border-2 border-[#2c2c2c] bg-[#0f0f0f] shadow-[0_28px_70px_rgba(0,0,0,0.88)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start gap-5 border-b border-[#242424] px-6 py-6 md:px-7">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-2 border-[#303030] bg-[#0d0d0d] md:h-20 md:w-20">
            <div className={`${experience.logoBackground === 'light' ? 'border-[#e7e7e7] bg-white' : 'border-[#292929] bg-[#151515]'} flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border md:h-16 md:w-16`}>
              <img
                src={experience.logo}
                alt={experience.logoAlt}
                className="h-full w-full object-contain p-1.5"
                loading="lazy"
              />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-xl font-semibold leading-tight text-white md:text-2xl">{experience.role}</h3>
            <p className="mt-1.5 text-[17px] font-medium text-[#a8a8a8] md:text-[18px]">{experience.company}</p>
            <p className="mt-3 inline-flex rounded-lg border border-[#2c2c2c] bg-[#121212] px-3 py-1.5 text-[14px] font-semibold text-[#808080] md:text-[15px]">
              {experience.period}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#353535] text-[#777] transition-all duration-150 hover:border-[#4a4a4a] hover:bg-[#1a1a1a] hover:text-white"
            aria-label="Close experience details"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-6 md:px-7">
          <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#666]">Responsibilities</p>
          <ul className="space-y-3.5">
            {experience.responsibilities.map((responsibility) => (
              <li key={responsibility} className="flex gap-3 text-[16px] leading-relaxed text-[#b4b4b4] md:text-[17px]">
                <span className="mt-[0.72em] h-1.5 w-1.5 shrink-0 rounded-full bg-[#747474]" aria-hidden="true"></span>
                <span>{responsibility}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default function ExperienceTimeline({ experiences }: Props) {
  const [selected, setSelected] = useState<Experience | null>(null)

  return (
    <>
      <section id="experience" className="animate-fade-up delay-4 py-24 md:py-28 border-t border-[var(--color-border)]">
        <h2 className="text-2xl md:text-3xl xl:text-[2.125rem] font-semibold mb-4 tracking-tight text-[var(--color-foreground)]">Experience</h2>
        <p className="text-[17px] md:text-[19px] xl:text-[20px] text-[var(--color-muted)] mb-12 md:mb-14 max-w-none leading-relaxed">
          Recent roles and teams I have contributed to, from product engineering to data-processing systems.
        </p>

        <div className="relative mx-auto max-w-[58rem]">
          <div className="absolute left-1/2 top-8 bottom-8 w-px -translate-x-1/2 bg-[#303030]" aria-hidden="true"></div>

          <div className="space-y-11 md:space-y-12">
            {experiences.map((experience, index) => {
              const isLeft = index % 2 === 1

              return (
                <button
                  type="button"
                  key={`${experience.company}-${experience.role}`}
                  onClick={() => setSelected(experience)}
                  className="group relative grid w-full grid-cols-[minmax(0,1fr)_4.5rem_minmax(0,1fr)] items-center gap-4 text-left md:grid-cols-[minmax(0,1fr)_5rem_minmax(0,1fr)] md:gap-7"
                >
                  <div className={`${isLeft ? 'col-start-1 text-right items-end' : 'col-start-3 text-left items-start'} flex min-w-0 flex-col transition-all duration-200 group-hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.08)]`}>
                    <h3 className="text-[1.125rem] md:text-xl font-semibold leading-snug text-white transition-colors duration-200 group-hover:text-[#f1f1f1]">
                      {experience.role}
                    </h3>
                    <p className="mt-1.5 text-[16px] md:text-[17px] font-medium leading-relaxed text-[#a8a8a8] transition-colors duration-200 group-hover:text-[#c2c2c2]">
                      {experience.company}
                    </p>
                    <p className="mt-2 inline-flex rounded-lg border border-[#252525] bg-[#101010] px-3 py-1.5 text-[14px] md:text-[15px] font-semibold leading-snug text-[#777] transition-all duration-200 group-hover:border-[#383838] group-hover:text-[#9a9a9a]">
                      {experience.period}
                    </p>
                  </div>

                  <div className="relative z-10 col-start-2 row-start-1 mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#303030] bg-[#0d0d0d] shadow-[0_0_0_10px_#0a0a0a] transition-all duration-200 group-hover:border-[#4a4a4a] group-hover:shadow-[0_0_0_10px_#0a0a0a,0_0_26px_rgba(255,255,255,0.11)] md:h-20 md:w-20 md:shadow-[0_0_0_12px_#0a0a0a] md:group-hover:shadow-[0_0_0_12px_#0a0a0a,0_0_26px_rgba(255,255,255,0.11)]">
                    <div className={`${experience.logoBackground === 'light' ? 'border-[#e7e7e7] bg-white' : 'border-[#292929] bg-[#151515]'} flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border md:h-14 md:w-14`}>
                      <img
                        src={experience.logo}
                        alt={experience.logoAlt}
                        width="48"
                        height="48"
                        loading="lazy"
                        className="h-full w-full object-contain p-1"
                      />
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      <ExperienceModal experience={selected} onClose={() => setSelected(null)} />
    </>
  )
}
