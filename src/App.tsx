import { lazy, Suspense, useState, useCallback } from 'react'
import { Leva } from 'leva'
import { ArrowLeft } from 'lucide-react'
import Gallery from '@/components/Gallery'

/* ── Lazy-loaded scene components ────────────────────── */

const sceneComponents = {
  'lambo-envmaps': lazy(() => import('./scenes/lambo-envmaps')),
  'porsche-live-envmaps': lazy(() => import('./scenes/porsche-live-envmaps')),
  'porsche-ground-projection': lazy(() => import('./scenes/porsche-ground-projection')),
  'datsun-ssgi': lazy(() => import('./scenes/datsun-ssgi')),
  'env-transitions': lazy(() => import('./scenes/env-transitions')),
  'viewcube': lazy(() => import('./scenes/viewcube')),
  'gltf-reuse': lazy(() => import('./scenes/gltf-reuse')),
} as const

type SceneKey = keyof typeof sceneComponents

const ConfiguratorLazy = lazy(() => import('./configurator'))

/* ── App shell ───────────────────────────────────────── */

type View = 'gallery' | 'scene' | 'configurator'

export default function App() {
  const [view, setView] = useState<View>('gallery')
  const [activeScene, setActiveScene] = useState<SceneKey | null>(null)
  const [previewMode, setPreviewMode] = useState<'3d' | 'image'>('3d')

  const openScene = useCallback((key: string) => {
    setActiveScene(key as SceneKey)
    setView('scene')
  }, [])

  const openConfigurator = useCallback(() => setView('configurator'), [])

  const goHome = useCallback(() => {
    setView('gallery')
    setActiveScene(null)
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
        onOpenScene={openScene}
        onOpenConfigurator={openConfigurator}
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
