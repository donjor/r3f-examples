import { lazy, Suspense, useState, useCallback, useSyncExternalStore } from 'react'
import { Leva } from 'leva'
import { ArrowLeft } from 'lucide-react'
import Gallery from '@/components/Gallery'

/* ── Lazy-loaded scene components ────────────────────── */

const sceneComponents = {
  'lambo-envmaps': lazy(() => import('./scenes/lambo-envmaps')),
  'porsche-live-envmaps': lazy(() => import('./scenes/porsche-live-envmaps')),
  'porsche-showcase': lazy(() => import('./scenes/porsche-showcase')),
  'porsche-ground-projection': lazy(() => import('./scenes/porsche-ground-projection')),
  'datsun-ssgi': lazy(() => import('./scenes/datsun-ssgi')),
  'env-transitions': lazy(() => import('./scenes/env-transitions')),
  'viewcube': lazy(() => import('./scenes/viewcube')),
  'gltf-reuse': lazy(() => import('./scenes/gltf-reuse')),
  'shopping': lazy(() => import('./scenes/shopping')),
  'ecctrl-fisheye': lazy(() => import('./scenes/ecctrl-fisheye')),
  'object-clump': lazy(() => import('./scenes/object-clump')),
  'gltf-animations-tied-to-scroll': lazy(() => import('./scenes/gltf-animations-tied-to-scroll')),
  'enter-portals': lazy(() => import('./scenes/enter-portals')),
  'frosted-glass': lazy(() => import('./scenes/frosted-glass')),
  'view-tracking': lazy(() => import('./scenes/view-tracking')),
} as const

type SceneKey = keyof typeof sceneComponents

const ConfiguratorLazy = lazy(() => import('./configurator'))

/* ── Hash-based routing ──────────────────────────────── */

type View = 'gallery' | 'scene' | 'configurator'

interface RouteState {
  view: View
  activeScene: SceneKey | null
}

function parseHash(hash: string): RouteState {
  const h = hash.replace(/^#\/?/, '')
  if (h === 'configurator') return { view: 'configurator', activeScene: null }
  const sceneMatch = h.match(/^scene\/(.+)$/)
  if (sceneMatch && sceneMatch[1] in sceneComponents) {
    return { view: 'scene', activeScene: sceneMatch[1] as SceneKey }
  }
  return { view: 'gallery', activeScene: null }
}

function subscribeHash(cb: () => void) {
  window.addEventListener('hashchange', cb)
  return () => window.removeEventListener('hashchange', cb)
}

function getHashSnapshot() {
  return window.location.hash
}

/* ── App shell ───────────────────────────────────────── */

export default function App() {
  const hash = useSyncExternalStore(subscribeHash, getHashSnapshot)
  const { view, activeScene } = parseHash(hash)
  const [previewMode, setPreviewMode] = useState<'3d' | 'image'>('3d')

  const goHome = useCallback(() => {
    window.location.hash = '#/'
  }, [])

  /* active scene */
  if (view === 'scene' && activeScene) {
    const Scene = sceneComponents[activeScene]
    return (
      <>
        <Leva collapsed />
        <BackButton onClick={goHome} />
        <Suspense fallback={<Spinner />}>
          <Scene />
        </Suspense>
      </>
    )
  }

  /* configurator */
  if (view === 'configurator') {
    return (
      <>
        <Leva hidden />
        <BackButton onClick={goHome} />
        <Suspense fallback={<Spinner text="Loading configurator…" />}>
          <ConfiguratorLazy />
        </Suspense>
      </>
    )
  }

  /* gallery */
  return (
    <>
      <Leva hidden />
      <Gallery
        previewMode={previewMode}
        onPreviewModeChange={setPreviewMode}
      />
    </>
  )
}

/* ── Back button ─────────────────────────────────────── */

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed top-4 left-4 z-[1000] flex items-center gap-2 pl-3.5 pr-4 py-2 rounded-full bg-black/50 backdrop-blur-2xl border border-white/[0.08] text-[13px] font-medium text-white/70 hover:bg-black/70 hover:text-white transition-all duration-200"
    >
      <ArrowLeft className="size-3.5" />
      Back
    </button>
  )
}

/* ── Loading spinner ─────────────────────────────────── */

function Spinner({ text = 'Loading…' }: { text?: string }) {
  return (
    <div className="flex items-center justify-center h-screen bg-[#07070a]">
      <div className="flex flex-col items-center gap-4">
        <div className="size-7 border-[2px] border-white/[0.08] border-t-white/60 rounded-full animate-spin" />
        <span className="text-xs text-white/25 tracking-wide">{text}</span>
      </div>
    </div>
  )
}
