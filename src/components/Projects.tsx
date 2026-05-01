import { useState } from 'react'
import { FEATURED_PROJECT_TITLES, PRIORITIZED_ALL_TITLE_ORDER } from '../config/projects-display'
import { projects } from '../data/portfolio'
import type { Project } from '../data/portfolio'
import ProjectModal from './ProjectModal'

const GithubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
)

const ExternalIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
)

const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
)

const PlayIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
)

const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
)

function iconForType(type: string) {
  switch (type) {
    case 'github': return <GithubIcon />
    case 'download': return <DownloadIcon />
    case 'demo': return <PlayIcon />
    default: return <ExternalIcon />
  }
}

export default function Projects() {
  const [showAll, setShowAll] = useState(false)
  const [selected, setSelected] = useState<Project | null>(null)

  const prioritizedAllTitleSet = new Set<string>(PRIORITIZED_ALL_TITLE_ORDER)

  const featured = FEATURED_PROJECT_TITLES
    .map((title) => projects.find((project) => project.title === title))
    .filter((project): project is Project => project !== undefined)

  const allOrdered = [
    ...PRIORITIZED_ALL_TITLE_ORDER
      .map((title) => projects.find((project) => project.title === title))
      .filter((project): project is Project => project !== undefined),
    ...projects.filter((project) => !prioritizedAllTitleSet.has(project.title)),
  ]

  const displayed = showAll ? allOrdered : featured

  return (
    <>
      <section id="projects" className="py-24 md:py-28 border-t border-[var(--color-border)]">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-4 md:mb-5">
          <h2 className="text-2xl md:text-3xl xl:text-[2.125rem] font-semibold tracking-tight text-[var(--color-foreground)]">
            {showAll ? 'All Projects' : 'Featured Projects'}
          </h2>
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-2 self-start sm:self-auto text-[16px] md:text-[17px] font-semibold px-5 py-2.5 rounded-xl border-2 border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-[#141414] hover:border-[#3a3a3a] transition-all duration-150"
          >
            {showAll ? 'Show Featured' : 'Show All'}
            <ChevronRight />
          </button>
        </div>
        <p className="text-[17px] md:text-[19px] xl:text-[20px] text-[var(--color-muted)] mb-12 md:mb-14 max-w-none leading-relaxed">
          Selected work that reflects how I approach product, engineering, and problem solving.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 md:gap-8 xl:gap-10">
          {displayed.map((project) => (
            <article
              key={project.title}
              onClick={() => setSelected(project)}
              className="group flex flex-col rounded-2xl border-2 border-[var(--color-border)] bg-[#111111] overflow-hidden hover:border-[#404040] hover:-translate-y-0.5 hover:shadow-[0_20px_56px_rgba(0,0,0,0.58)] transition-all duration-200 cursor-pointer"
            >
              {project.image && (
                <div className="w-full aspect-[16/9] overflow-hidden bg-[#0d0d0d]">
                  <img
                    src={project.image}
                    alt={`Screenshot of ${project.title}`}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              )}

              <div className="flex flex-col flex-1 p-6 md:p-7 lg:p-8 gap-4 md:gap-5">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-[1.125rem] md:text-xl lg:text-[1.35rem] font-semibold text-foreground leading-snug">
                    {project.title}
                  </h3>
                  <span className="text-[15px] md:text-base text-[var(--color-muted)] shrink-0 mt-0.5 whitespace-nowrap tabular-nums font-medium">
                    {project.period}
                  </span>
                </div>

                <p className="text-[17px] md:text-[18px] lg:text-[19px] text-[var(--color-muted)] leading-[1.65]">
                  {project.description}
                </p>

                <div className="mt-auto pt-1 flex flex-wrap items-center gap-2 md:gap-2.5">
                  <span className="text-[15px] md:text-[16px] text-[#707070] mr-0.5 font-semibold">Built with</span>
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="text-[14px] md:text-[15px] px-3.5 py-2 md:px-4 md:py-2 rounded-lg border-2 border-[#333] text-[#b0b0b0] bg-[#0d0d0d] leading-snug font-semibold"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between gap-3 pt-4 border-t-2 border-[#1f1f1f]">
                  {project.links.length > 0 && (
                    <div className="flex flex-wrap gap-2.5">
                      {project.links.map((link) => (
                        <a
                          key={link.label}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-2 text-[15px] md:text-[16px] font-semibold px-4 py-2 rounded-lg border-2 border-[#3a3a3a] text-[#d0d0d0] hover:text-white hover:border-[#666] bg-[#121212] transition-all duration-150"
                        >
                          {iconForType(link.icon)}
                          {link.label}
                        </a>
                      ))}
                    </div>
                  )}
                  <button
                    type="button"
                    className="ml-auto flex items-center gap-2 text-[15px] md:text-[16px] font-semibold px-4 py-2 rounded-lg border-2 border-[#3a3a3a] text-[#d0d0d0] hover:text-white hover:border-[#666] bg-[#121212] transition-all duration-150 whitespace-nowrap shrink-0"
                  >
                    View readme
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </>
  )
}
