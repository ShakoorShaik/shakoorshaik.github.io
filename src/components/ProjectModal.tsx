import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Project } from '../data/portfolio'

const GithubIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
)

const ExternalIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
)

const PlayIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
)

function linkIcon(icon: string) {
  if (icon === 'github') return <GithubIcon />
  if (icon === 'demo' || icon === 'play') return <PlayIcon />
  return <ExternalIcon />
}

interface Props {
  project: Project | null
  onClose: () => void
}

export default function ProjectModal({ project, onClose }: Props) {
  const readmeScrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!project) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    const previousBodyOverflow = document.body.style.overflow
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    // Always open each README from the top for a consistent view.
    readmeScrollRef.current?.scrollTo({ top: 0, behavior: 'auto' })
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousBodyOverflow
    }
  }, [project, onClose])

  if (!project) return null

  const modalContent = (
    <div
      className="modal-backdrop fixed inset-0 z-[9999] flex items-start sm:items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-sm"
      onClick={onClose}
    >
      {/*
        Panel — flex col + overflow-hidden clips corners cleanly.
        Body uses flex-1 min-h-0 so overflow-y-auto works inside flex.
        position:fixed works because the fadeUp animation no longer retains
        transform after it finishes (transform was removed from the 'to' keyframe).
      */}
      <div
        className="modal-panel relative w-full max-w-[min(96vw,1180px)] flex flex-col bg-[#0f0f0f] border-2 border-[#2c2c2c] rounded-2xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.95)]"
        style={{ maxHeight: 'calc(100dvh - 2rem)', minHeight: 'min(90dvh, 720px)' }}
        onClick={e => e.stopPropagation()}
      >

        {/* ── Header ──────────────────────────────────────── */}
        <div className="shrink-0 px-6 md:px-10 lg:px-12 pt-7 pb-6 border-b border-[#212121]">
          <div className="flex items-start gap-5">
            <div className="flex-1 min-w-0">

              <div className="flex items-baseline gap-3 flex-wrap mb-2">
                <h2 className="text-xl md:text-2xl font-semibold text-white tracking-tight">
                  {project.title}
                </h2>
                <span className="text-[13px] md:text-sm text-[#6a6a6a] uppercase tracking-wide font-semibold">
                  {project.period}
                </span>
              </div>

              <p className="text-[17px] md:text-[18px] lg:text-[19px] text-[#a8a8a8] leading-relaxed mb-5 max-w-none">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2.5">
                {project.links.map(link => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[15px] md:text-[16px] font-semibold px-4 py-2.5 rounded-lg border-2 border-[#3a3a3a] text-[#d4d4d4] hover:text-white hover:border-[#666] bg-[#161616] transition-all duration-150"
                  >
                    {linkIcon(link.icon)}
                    {link.label}
                  </a>
                ))}
              </div>

            </div>

            <button
              onClick={onClose}
              className="shrink-0 w-9 h-9 flex items-center justify-center rounded-lg border border-[#353535] text-[#707070] hover:text-white hover:bg-[#1c1c1c] hover:border-[#4a4a4a] transition-all duration-150"
              aria-label="Close"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Scrollable body ──────────────────────────────────
            flex-1 min-h-0: required so overflow-y-auto is bounded
            by the parent's height instead of expanding infinitely.
        ──────────────────────────────────────────────────────── */}
        <div ref={readmeScrollRef} className="flex-1 min-h-0 overflow-y-auto overscroll-contain bg-[#0a0a0a]">
          <div className="w-full max-w-[56rem] mx-auto px-6 md:px-12 lg:px-14 py-8 md:py-10 pb-16">
            {project.image && (
              <div className="mb-8">
                <p className="text-[11px] font-semibold text-[#555] uppercase tracking-[0.12em] mb-2">Cover</p>
                <img
                  src={project.image}
                  alt={`${project.title} cover`}
                  className="w-full h-auto max-h-[420px] object-contain rounded-xl border border-[#2a2a2a] bg-black"
                  loading="lazy"
                />
              </div>
            )}

            {project.demoVideo && (
              <div className="mb-8">
                <p className="text-[11px] font-semibold text-[#555] uppercase tracking-[0.12em] mb-2">Demo</p>
                <video
                  src={project.demoVideo}
                  controls
                  playsInline
                  preload="metadata"
                  className="w-full rounded-xl border border-[#2a2a2a] bg-black"
                />
              </div>
            )}

            <Markdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: () => null,
                h2: ({ children }) => (
                  <h2 className="text-[1.125rem] md:text-xl font-semibold text-white mt-8 mb-3 first:mt-0 pb-2 border-b border-[#282828]">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-[17px] md:text-[18px] font-semibold text-[#e0e0e0] mt-6 mb-2">{children}</h3>
                ),
                p: ({ children }) => (
                  <p className="text-[17px] md:text-[18px] text-[#a8a8a8] leading-[1.75] mb-4">{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-outside pl-6 mb-6 space-y-2.5 text-[17px] md:text-[18px] text-[#a8a8a8]">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-outside pl-6 mb-6 space-y-2.5 text-[17px] md:text-[18px] text-[#a8a8a8]">{children}</ol>
                ),
                li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                hr: () => <hr className="border-[#1c1c1c] my-6" />,
                strong: ({ children }) => (
                  <strong className="font-semibold text-[#c8c8c8]">{children}</strong>
                ),
                a: ({ href, children }) => (
                  <a href={href} target="_blank" rel="noopener noreferrer"
                    className="text-[#777] underline underline-offset-4 hover:text-white transition-colors duration-150">
                    {children}
                  </a>
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto mb-7 w-full rounded-xl border-2 border-[#2c2c2c]">
                    <table className="w-full border-collapse text-[16px] md:text-[17px]">{children}</table>
                  </div>
                ),
                thead: ({ children }) => <thead>{children}</thead>,
                tbody: ({ children }) => <tbody>{children}</tbody>,
                tr: ({ children }) => <tr className="border-b border-[#1c1c1c]">{children}</tr>,
                th: ({ children }) => (
                  <th className="text-left text-[13px] md:text-sm font-semibold text-[#8a8a8a] uppercase tracking-[0.08em] py-3.5 px-4 border-b border-[#383838]">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="py-3.5 px-4 text-[#a8a8a8] align-top">{children}</td>
                ),
                code: ({ children }) => (
                  <code className="font-mono text-[14px] md:text-[15px] px-2 py-0.5 rounded-md bg-[#141414] border border-[#333] text-[#c4c4c4]">
                    {children}
                  </code>
                ),
                pre: ({ children }) => (
                  <pre className="bg-[#0d0d0d] border-2 border-[#2e2e2e] rounded-xl p-6 overflow-x-auto mb-6 text-[15px] md:text-[16px] text-[#c4c4c4] font-mono leading-relaxed">
                    {children}
                  </pre>
                ),
              }}
            >
              {project.readme}
            </Markdown>

          </div>
        </div>

      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
