import { useRef, useCallback, useEffect, useState, type ComponentType } from 'react'
import {
  Layers,
  Eye,
  Image as ImageIcon,
  Sparkles,
  Video,
  Globe,
  Sun,
  Palette,
  Box,
  Copy,
  Settings,
  ArrowRight,
} from 'lucide-react'
import ModelPreview from './ModelPreview'

/* ═══════════════════════════════════════════════════════
   Types
   ═══════════════════════════════════════════════════════ */

interface SceneInfo {
  key: string
  name: string
  subtitle: string
  desc: string
  tags: string[]
  preview: { type: 'model'; path: string } | { type: 'geometry'; shape: 'sphere' | 'torus' }
  icon: ComponentType<{ className?: string }>
  accent: string
  featured?: boolean
}

interface GalleryProps {
  previewMode: '3d' | 'image'
  onPreviewModeChange: (mode: '3d' | 'image') => void
  onOpenScene: (key: string) => void
  onOpenConfigurator: () => void
}

/* ═══════════════════════════════════════════════════════
   Scene registry
   ═══════════════════════════════════════════════════════ */

const scenes: SceneInfo[] = [
  {
    key: 'lambo-envmaps',
    name: 'Lamborghini Urus',
    subtitle: 'Environment Maps',
    desc: 'HDR environment reflections with Lightformer studio lighting and LUT color grading.',
    tags: ['HDR', 'Lightformers', 'LUT'],
    preview: { type: 'model', path: '/lambo.glb' },
    icon: Sparkles,
    accent: '#f59e0b',
    featured: true,
  },
  {
    key: 'porsche-live-envmaps',
    name: 'Porsche 911',
    subtitle: 'Live Environment Maps',
    desc: 'Animated orbital camera with adaptive performance monitoring and accumulative shadows.',
    tags: ['Animation', 'Adaptive', 'Shadows'],
    preview: { type: 'model', path: '/911-transformed.glb' },
    icon: Video,
    accent: '#818cf8',
  },
  {
    key: 'porsche-showcase',
    name: 'Porsche 911',
    subtitle: 'Showcase & Freeform',
    desc: 'Dual camera modes — automated orbital showcase and unlocked freeform orbit controls.',
    tags: ['Camera', 'OrbitControls', 'Interactive'],
    preview: { type: 'model', path: '/911-transformed.glb' },
    icon: Eye,
    accent: '#a78bfa',
  },
  {
    key: 'porsche-ground-projection',
    name: 'Porsche 930',
    subtitle: 'Ground Projection',
    desc: 'Ground-projected HDRI skybox with fisheye distortion and custom tone mapping.',
    tags: ['Fisheye', 'HDRI', 'Tone Mapping'],
    preview: { type: 'model', path: '/porsche-transformed.glb' },
    icon: Globe,
    accent: '#34d399',
  },
  {
    key: 'datsun-ssgi',
    name: 'Datsun 240Z',
    subtitle: 'SSGI & Ambient Occlusion',
    desc: 'Screen-space global illumination with N8AO, Bloom, and screenshot capture.',
    tags: ['N8AO', 'Bloom', 'Screenshot'],
    preview: { type: 'model', path: '/datsun-transformed.glb' },
    icon: Sun,
    accent: '#fbbf24',
  },
  {
    key: 'env-transitions',
    name: 'Environment',
    subtitle: 'Preset Transitions',
    desc: 'Smooth animated transitions between 10 drei environment presets on a metallic sphere.',
    tags: ['Transitions', 'Presets', 'Interactive'],
    preview: { type: 'geometry', shape: 'sphere' },
    icon: Palette,
    accent: '#f472b6',
  },
  {
    key: 'viewcube',
    name: 'ViewCube',
    subtitle: 'HUD Overlay',
    desc: 'Interactive orientation gizmo rendered via RenderTexture face labels in a Hud layer.',
    tags: ['HUD', 'Overlay', 'RenderTexture'],
    preview: { type: 'geometry', shape: 'torus' },
    icon: Box,
    accent: '#22d3ee',
  },
  {
    key: 'gltf-reuse',
    name: 'GLTF Reuse',
    subtitle: 'Instanced Rendering',
    desc: 'Efficient geometry and material reuse with mirrored instancing of a shoe model.',
    tags: ['Instancing', 'Performance', 'Cloning'],
    preview: { type: 'model', path: '/shoe.gltf' },
    icon: Copy,
    accent: '#fb923c',
  },
]

/* ═══════════════════════════════════════════════════════
   Intersection observer hook (lazy-load 3D previews)
   ═══════════════════════════════════════════════════════ */

function useInView(margin = '300px') {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { rootMargin: margin },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [margin])

  return { ref, visible }
}

/* ═══════════════════════════════════════════════════════
   Gallery (main export)
   ═══════════════════════════════════════════════════════ */

export default function Gallery({
  previewMode,
  onPreviewModeChange,
  onOpenScene,
  onOpenConfigurator,
}: GalleryProps) {
  const scenesRef = useRef<HTMLDivElement>(null)

  /* cursor glow */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`)
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`)
    }
    window.addEventListener('mousemove', handler, { passive: true })
    return () => window.removeEventListener('mousemove', handler)
  }, [])

  const scrollToScenes = useCallback(() => {
    scenesRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <div className="h-full overflow-y-auto overflow-x-hidden scrollbar-thin relative z-10">
      {/* ── Navbar ──────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-14 bg-[#07070a]/60 backdrop-blur-2xl border-b border-white/[0.04]">
        <div className="flex items-center gap-2.5">
          <div className="size-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Layers className="size-3.5 text-white" />
          </div>
          <span className="text-[13px] font-semibold text-white/90 tracking-wide">
            R3F Showcase
          </span>
        </div>
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
          <ToggleBtn
            active={previewMode === '3d'}
            onClick={() => onPreviewModeChange('3d')}
            icon={Eye}
            label="3D"
          />
          <ToggleBtn
            active={previewMode === 'image'}
            onClick={() => onPreviewModeChange('image')}
            icon={ImageIcon}
            label="Static"
          />
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────── */}
      <section className="relative min-h-[88vh] flex items-center px-6 pt-14">
        {/* ambient glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,rgba(99,102,241,0.12),transparent)]" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

        <div className="relative w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* text */}
          <div className="space-y-7 max-lg:text-center max-lg:flex max-lg:flex-col max-lg:items-center">
            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-blue-400/70">
              Interactive 3D Showcase
            </p>
            <h1 className="text-5xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight leading-[1.05]">
              <span className="bg-gradient-to-b from-white via-white/90 to-white/50 text-gradient">
                React Three
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-pink-400 text-gradient">
                Fiber
              </span>
            </h1>
            <p className="text-base sm:text-lg text-white/35 max-w-md leading-relaxed">
              Explore interactive 3D scenes built with environment maps, post-processing
              effects, and a full vehicle configurator.
            </p>
            <div className="flex items-center gap-4 pt-1 max-lg:justify-center">
              <button
                onClick={scrollToScenes}
                className="group relative px-7 py-3 rounded-full text-sm font-semibold text-white overflow-hidden transition-shadow hover:shadow-[0_0_30px_rgba(99,102,241,0.3)]"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-violet-600 rounded-full" />
                <span className="relative flex items-center gap-2">
                  Explore Scenes
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </button>
              <button
                onClick={onOpenConfigurator}
                className="px-7 py-3 rounded-full border border-white/[0.08] text-sm font-medium text-white/60 hover:bg-white/[0.04] hover:text-white/90 hover:border-white/[0.14] transition-all"
              >
                Configurator
              </button>
            </div>
            <div className="flex items-center gap-10 pt-3 max-lg:justify-center">
              {[
                { n: '7', l: 'Scenes' },
                { n: '9', l: 'Vehicles' },
                { n: '4', l: 'Environments' },
              ].map((s) => (
                <div key={s.l}>
                  <div className="text-2xl font-bold text-white/85">{s.n}</div>
                  <div className="text-[10px] text-white/25 uppercase tracking-[0.15em] mt-0.5">
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3D hero preview */}
          <div className="relative aspect-square max-w-[520px] w-full mx-auto max-lg:max-w-[380px]">
            <div className="absolute -inset-8 bg-[radial-gradient(circle,rgba(99,102,241,0.08)_0%,transparent_70%)] rounded-full" />
            <div className="absolute inset-0 rounded-3xl ring-1 ring-white/[0.04] overflow-hidden">
              <ModelPreview modelPath="/lambo.glb" className="w-full h-full" quality="high" rotationSpeed={0.3} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Scenes grid ─────────────────────────────── */}
      <section ref={scenesRef} className="relative px-6 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white/90">Scenes</h2>
              <p className="text-sm text-white/25 mt-1.5">Interactive R3F demonstrations</p>
            </div>
            <span className="text-[11px] text-white/15 uppercase tracking-widest font-medium">
              {scenes.length} demos
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scenes.map((scene, i) => (
              <SceneCard
                key={scene.key}
                scene={scene}
                previewMode={previewMode}
                onClick={() => onOpenScene(scene.key)}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Configurator banner ──────────────────────── */}
      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto">
          <ConfiguratorBanner
            previewMode={previewMode}
            onClick={onOpenConfigurator}
          />
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────── */}
      <footer className="px-6 pb-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between pt-8 border-t border-white/[0.04]">
          <span className="text-[11px] text-white/15">
            Built with React Three Fiber & Three.js
          </span>
          <span className="text-[11px] text-white/15">R3F Showcase</span>
        </div>
      </footer>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   Toggle button (navbar)
   ═══════════════════════════════════════════════════════ */

function ToggleBtn({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: ComponentType<{ className?: string }>
  label: string
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-semibold transition-all duration-200 ${
        active
          ? 'bg-white/[0.08] text-white shadow-sm'
          : 'text-white/30 hover:text-white/55'
      }`}
    >
      <Icon className="size-3" />
      {label}
    </button>
  )
}

/* ═══════════════════════════════════════════════════════
   Scene card
   ═══════════════════════════════════════════════════════ */

function SceneCard({
  scene,
  previewMode,
  onClick,
  index,
}: {
  scene: SceneInfo
  previewMode: '3d' | 'image'
  onClick: () => void
  index: number
}) {
  const cardRef = useRef<HTMLButtonElement>(null)
  const { ref: sentinelRef, visible } = useInView()

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    el.style.transform = `perspective(1000px) rotateX(${y * -5}deg) rotateY(${x * 5}deg) scale(1.015)`
  }, [])

  const handleMouseLeave = useCallback(() => {
    const el = cardRef.current
    if (!el) return
    el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)'
  }, [])

  const Icon = scene.icon

  return (
    <button
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group relative flex flex-col rounded-2xl border border-white/[0.05] bg-white/[0.015] overflow-hidden text-left transition-[transform,border-color,box-shadow] duration-300 ease-out hover:border-white/[0.10] hover:shadow-[0_24px_80px_-20px_rgba(0,0,0,0.6)] animate-in fade-in slide-in-from-bottom-3 ${
        scene.featured ? 'md:col-span-2' : ''
      }`}
      style={{
        animationDelay: `${index * 70}ms`,
        animationFillMode: 'both',
        animationDuration: '550ms',
      }}
    >
      {/* sentinel for intersection observer */}
      <div ref={sentinelRef} className="absolute top-0 left-0 w-0 h-0" />

      {/* preview area */}
      <div className={`relative w-full ${scene.featured ? 'h-64 sm:h-72' : 'h-44 sm:h-52'}`}>
        {previewMode === '3d' && visible ? (
          <ModelPreview
            modelPath={scene.preview.type === 'model' ? scene.preview.path : undefined}
            geometry={scene.preview.type === 'geometry' ? scene.preview.shape : undefined}
            className="w-full h-full"
          />
        ) : (
          <ImagePlaceholder icon={Icon} accent={scene.accent} />
        )}
        {/* bottom fade into text area */}
        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#0c0c10] to-transparent pointer-events-none" />
      </div>

      {/* text area */}
      <div className="relative flex-1 p-5 pt-1 bg-[#0c0c10]">
        <div className="flex items-center gap-2 mb-1">
          <span className="size-3.5 shrink-0" style={{ color: scene.accent }}>
            <Icon className="size-3.5" />
          </span>
          <span
            className="text-[10px] uppercase tracking-[0.15em] font-semibold truncate"
            style={{ color: scene.accent + 'bb' }}
          >
            {scene.subtitle}
          </span>
        </div>
        <h3 className="text-[15px] font-semibold text-white/90 leading-snug">{scene.name}</h3>
        <p className="text-[12px] text-white/30 mt-1 leading-relaxed line-clamp-2">{scene.desc}</p>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {scene.tags.map((t) => (
            <span
              key={t}
              className="text-[9px] uppercase tracking-[0.1em] text-white/20 bg-white/[0.03] border border-white/[0.04] px-2 py-[3px] rounded-full"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* hover glow ring */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          boxShadow: `inset 0 1px 0 ${scene.accent}18, inset 0 0 40px ${scene.accent}06, 0 0 40px ${scene.accent}06`,
        }}
      />
    </button>
  )
}

/* ═══════════════════════════════════════════════════════
   Static image placeholder (for image mode & pre-load)
   ═══════════════════════════════════════════════════════ */

function ImagePlaceholder({
  icon: Icon,
  accent,
}: {
  icon: ComponentType<{ className?: string }>
  accent: string
}) {
  return (
    <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
      {/* radial accent */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 60%, ${accent}12, transparent 65%)`,
        }}
      />
      {/* grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <Icon className="size-12 text-white/[0.04]" />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   Configurator banner
   ═══════════════════════════════════════════════════════ */

function ConfiguratorBanner({
  previewMode,
  onClick,
}: {
  previewMode: '3d' | 'image'
  onClick: () => void
}) {
  const { ref, visible } = useInView()

  return (
    <button
      onClick={onClick}
      className="group w-full rounded-2xl border border-white/[0.05] bg-gradient-to-br from-white/[0.025] to-white/[0.005] overflow-hidden text-left transition-all duration-300 hover:border-white/[0.10] hover:shadow-[0_24px_80px_-20px_rgba(0,0,0,0.6)] animate-in fade-in slide-in-from-bottom-3"
      style={{ animationDelay: '600ms', animationFillMode: 'both', animationDuration: '550ms' }}
    >
      <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2">
        {/* text side */}
        <div className="p-10 lg:p-14 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-5">
            <Settings className="size-4 text-violet-400" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-400/80">
              Vehicle Configurator
            </span>
          </div>
          <h3 className="text-3xl sm:text-4xl font-bold text-white/90 leading-tight mb-3">
            Build Your Ride
          </h3>
          <p className="text-sm text-white/30 mb-8 max-w-sm leading-relaxed">
            Choose from 9 vehicles, customize paint colors, switch between 4 studio
            environments, and toggle post-processing effects in real-time.
          </p>
          <div className="flex items-center gap-2 text-sm font-medium text-blue-400 group-hover:gap-3 transition-all duration-300">
            Launch Configurator
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>

        {/* preview side */}
        <div className="relative h-64 lg:h-auto min-h-[280px]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_50%,rgba(139,92,246,0.08),transparent_60%)]" />
          {previewMode === '3d' && visible ? (
            <ModelPreview
              modelPath="/models/ford-mustang-gt/model.low.glb"
              className="w-full h-full"
              rotationSpeed={0.3}
            />
          ) : (
            <ImagePlaceholder icon={Settings} accent="#8b5cf6" />
          )}
        </div>
      </div>
    </button>
  )
}
