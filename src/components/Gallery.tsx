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
  ShoppingBag,
  ScrollText,
  Aperture,
  Snowflake,
  LayoutGrid,
  Droplets,
  Cloud,
  SwatchBook,
  Gem,
  Zap,
  Hexagon,
  Laptop,
  Watch,
  Smile,
  Route,
  Frame,
  Footprints,
  Fish,
  Shirt,
  Train,
  Flame,
  Leaf,
  Hexagon as HexIcon,
  ToggleRight,
} from 'lucide-react'
import ModelPreview from './ModelPreview'

/* ═══════════════════════════════════════════════════════
   Types
   ═══════════════════════════════════════════════════════ */

type Group =
  | 'environment'
  | 'effects'
  | 'caustics'
  | 'shaders'
  | 'scroll'
  | 'motion'
  | 'interaction'
  | 'configurator'
  | 'utility'

interface SceneInfo {
  key: string
  name: string
  subtitle: string
  desc: string
  tags: string[]
  preview:
    | { type: 'model'; path: string }
    | { type: 'geometry'; shape: 'sphere' | 'torus' }
    | { type: 'image'; path: string }
  icon: ComponentType<{ className?: string }>
  accent: string
  featured?: boolean
  category: 'example' | 'custom'
  group?: Group
}

const GROUPS: { key: Group; label: string; desc: string }[] = [
  { key: 'environment', label: 'Environment', desc: 'HDR, lightformers, sky' },
  { key: 'effects', label: 'Postprocessing', desc: 'SSGI, bloom, LUT, godrays' },
  { key: 'caustics', label: 'Caustics & Glass', desc: 'Transmission, refraction' },
  { key: 'shaders', label: 'Shaders', desc: 'Custom GLSL, instancing' },
  { key: 'scroll', label: 'Scroll & Views', desc: 'ScrollControls, multi-viewport' },
  { key: 'motion', label: 'Motion & Animation', desc: 'Paths, mixer, fragments' },
  { key: 'interaction', label: 'Interaction', desc: 'react-spring, controls' },
  { key: 'configurator', label: 'Configurators', desc: 'State-driven, decals' },
  { key: 'utility', label: 'Utility', desc: 'HUD, instancing, edges' },
]

interface GalleryProps {
  previewMode: '3d' | 'image'
  onPreviewModeChange: (mode: '3d' | 'image') => void
}

/* ═══════════════════════════════════════════════════════
   Scene registry
   ═══════════════════════════════════════════════════════ */

const scenes: SceneInfo[] = [
  // ── Environment & lighting ────────────────────────────
  {
    key: 'lambo-envmaps',
    group: 'environment',
    name: 'Lamborghini Urus',
    subtitle: 'Environment Maps',
    desc: 'HDR environment reflections with Lightformer studio lighting and LUT color grading.',
    tags: ['HDR', 'Lightformers', 'LUT'],
    preview: { type: 'model', path: '/lambo.glb' },
    icon: Sparkles,
    accent: '#f59e0b',
    featured: true,
    category: 'example',
  },
  {
    key: 'porsche-live-envmaps',
    group: 'environment',
    name: 'Porsche 911',
    subtitle: 'Live Environment Maps',
    desc: 'Animated orbital camera with adaptive performance monitoring and accumulative shadows.',
    tags: ['Animation', 'Adaptive', 'Shadows'],
    preview: { type: 'model', path: '/911-transformed.glb' },
    icon: Video,
    accent: '#818cf8',
    category: 'example',
  },
  {
    key: 'porsche-ground-projection',
    group: 'environment',
    name: 'Porsche 930',
    subtitle: 'Ground Projection',
    desc: 'Ground-projected HDRI skybox with fisheye distortion and custom tone mapping.',
    tags: ['Fisheye', 'HDRI', 'Tone Mapping'],
    preview: { type: 'model', path: '/porsche-transformed.glb' },
    icon: Globe,
    accent: '#34d399',
    category: 'example',
  },
  {
    key: 'env-transitions',
    group: 'environment',
    name: 'Environment',
    subtitle: 'Preset Transitions',
    desc: 'Smooth animated transitions between 10 drei environment presets on a metallic sphere.',
    tags: ['Transitions', 'Presets', 'Interactive'],
    preview: { type: 'geometry', shape: 'sphere' },
    icon: Palette,
    accent: '#f472b6',
    category: 'example',
  },
  {
    key: 'color-grading',
    group: 'environment',
    name: 'Color Grading',
    subtitle: 'LUT Postprocessing',
    desc: 'Cubicle-99 LUT cube applied via three-stdlib LUTPass over a clearcoated terrazo sphere.',
    tags: ['LUT', 'three-stdlib', 'Effects'],
    preview: { type: 'image', path: '/thumbs/color-grading.webp' },
    icon: SwatchBook,
    accent: '#fde047',
    category: 'example',
  },
  // ── Postprocessing & effects ──────────────────────────
  {
    key: 'datsun-ssgi',
    group: 'effects',
    name: 'Datsun 240Z',
    subtitle: 'SSGI & Ambient Occlusion',
    desc: 'Screen-space global illumination with N8AO, Bloom, and screenshot capture.',
    tags: ['N8AO', 'Bloom', 'Screenshot'],
    preview: { type: 'model', path: '/datsun-transformed.glb' },
    icon: Sun,
    accent: '#fbbf24',
    category: 'example',
  },
  {
    key: 'shopping',
    group: 'effects',
    name: 'Shopping Kitchen',
    subtitle: 'Selection & Outline',
    desc: 'Hover-driven Selection/Outline with N8AO + TiltShift in a parallax-tracked kitchen scene.',
    tags: ['Selection', 'Outline', 'N8AO', 'TiltShift'],
    preview: { type: 'image', path: '/thumbs/shopping.webp' },
    icon: ShoppingBag,
    accent: '#f472b6',
    category: 'example',
  },
  {
    key: 'volumetric-light-godray',
    group: 'effects',
    name: 'Volumetric Godray',
    subtitle: 'GodRays + Video',
    desc: 'Video texture emitter projecting volumetric godrays onto a reflective floor with cube-cam sphere.',
    tags: ['GodRays', 'VideoTexture', 'MeshReflector', 'Bloom'],
    preview: { type: 'image', path: '/thumbs/volumetric-light-godray.webp' },
    icon: Zap,
    accent: '#fcd34d',
    category: 'example',
  },
  {
    key: 'lusion-connectors',
    group: 'effects',
    name: 'Connectors',
    subtitle: 'Rapier Floating Boxes',
    desc: 'Cuboid colliders attracted to center under zero-gravity Rapier physics, with N8AO and accent lights.',
    tags: ['Rapier', 'Physics', 'N8AO', 'Transmission'],
    preview: { type: 'image', path: '/thumbs/lusion-connectors.webp' },
    icon: Hexagon,
    accent: '#4060ff',
    category: 'example',
  },
  // ── Portals & transmission ────────────────────────────
  {
    key: 'enter-portals',
    group: 'caustics',
    name: 'Enter Portals',
    subtitle: 'MeshPortalMaterial',
    desc: 'Three framed portals you double-click to enter — Drei MeshPortalMaterial with camera transition.',
    tags: ['Portals', 'MeshPortalMaterial', 'CameraControls'],
    preview: { type: 'image', path: '/thumbs/enter-portals.webp' },
    icon: Aperture,
    accent: '#e879f9',
    category: 'example',
  },
  {
    key: 'frosted-glass',
    group: 'caustics',
    name: 'Frosted Glass',
    subtitle: 'Transmission Lens',
    desc: 'Pointer-following frosted glass disk reveals a Nike shoe behind it via MeshTransmissionMaterial.',
    tags: ['Transmission', 'Glass', 'Valtio', 'FramerMotion'],
    preview: { type: 'image', path: '/thumbs/frosted-glass.webp' },
    icon: Snowflake,
    accent: '#67e8f9',
    category: 'example',
  },
  {
    key: 'caustics',
    group: 'caustics',
    name: 'Caustics',
    subtitle: 'Glass + Light Refraction',
    desc: 'Drinking glass with caustics, MeshTransmissionMaterial, and animated Lightformer studio.',
    tags: ['Caustics', 'Transmission', 'AccumulativeShadows'],
    preview: { type: 'image', path: '/thumbs/caustics.webp' },
    icon: Droplets,
    accent: '#fda4af',
    category: 'example',
  },
  {
    key: 'diamond-refraction',
    group: 'caustics',
    name: 'Diamond Refraction',
    subtitle: 'MeshRefractionMaterial',
    desc: 'Multi-bounce diamond refraction with chromatic aberration, caustics, and bloom.',
    tags: ['Refraction', 'Caustics', 'Bloom'],
    preview: { type: 'image', path: '/thumbs/diamond-refraction.webp' },
    icon: Gem,
    accent: '#a5f3fc',
    category: 'example',
  },
  {
    key: 'aquarium',
    group: 'caustics',
    name: 'Aquarium',
    subtitle: 'Stencil + Transmission',
    desc: 'Sea turtle and floating spheres inside a glass cube — stencil-masked contents with iridescent transmission.',
    tags: ['Stencil', 'Transmission', 'Instancing', 'Animation'],
    preview: { type: 'image', path: '/thumbs/aquarium.webp' },
    icon: Fish,
    accent: '#7dd3fc',
    category: 'example',
  },
  // ── Shaders & custom materials ────────────────────────
  {
    key: 'shader-fire',
    group: 'shaders',
    name: 'Shader Fire',
    subtitle: 'Volumetric Raymarch',
    desc: 'Ray-marched volumetric fire driven by simplex-noise turbulence inside a unit cube ShaderMaterial.',
    tags: ['ShaderMaterial', 'GLSL', 'Volumetric'],
    preview: { type: 'image', path: '/thumbs/shader-fire.webp' },
    icon: Flame,
    accent: '#fb923c',
    category: 'example',
  },
  {
    key: 'grass-shader',
    group: 'shaders',
    name: 'Grass Shader',
    subtitle: 'Instanced Wind Sway',
    desc: '50,000 instanced grass blades with quaternion orientation and simplex-noise wind in a custom shader.',
    tags: ['Instancing', 'ShaderMaterial', 'Simplex'],
    preview: { type: 'image', path: '/thumbs/grass-shader.webp' },
    icon: Leaf,
    accent: '#86efac',
    category: 'example',
  },
  // ── Scroll & multi-viewport UI ────────────────────────
  {
    key: 'gltf-animations-tied-to-scroll',
    group: 'scroll',
    name: 'Scroll-Driven Animation',
    subtitle: 'ScrollControls + Mixer',
    desc: 'Skinned-mesh animation scrubbed by ScrollControls with SoftShadows and TiltShift bloom.',
    tags: ['ScrollControls', 'Animation', 'SoftShadows'],
    preview: { type: 'image', path: '/thumbs/gltf-animations-tied-to-scroll.webp' },
    icon: ScrollText,
    accent: '#10b981',
    category: 'example',
  },
  {
    key: 'view-tracking',
    group: 'scroll',
    name: 'View Tracking',
    subtitle: 'Multi-Viewport HTML',
    desc: 'Drei View — multiple 3D viewports tracked to HTML elements within a smooth-scrolled article.',
    tags: ['View', 'HTML', 'Lenis', 'OrbitControls'],
    preview: { type: 'image', path: '/thumbs/view-tracking.webp' },
    icon: LayoutGrid,
    accent: '#fbbf24',
    category: 'example',
  },
  {
    key: 'image-gallery',
    group: 'scroll',
    name: 'Image Gallery',
    subtitle: 'Reflective Wall',
    desc: 'Click-to-focus framed Pexels images on a MeshReflectorMaterial floor with smooth camera transitions.',
    tags: ['Reflections', 'Annotations', 'Image'],
    preview: { type: 'image', path: '/thumbs/image-gallery.webp' },
    icon: Frame,
    accent: '#fb7185',
    category: 'example',
  },
  // ── Animation & motion paths ──────────────────────────
  {
    key: 'motionpathcontrols',
    group: 'motion',
    name: 'Motion Path Controls',
    subtitle: 'Curve-Driven Camera',
    desc: 'Camera follows a switchable bezier path (Circle / Rollercoaster / Infinity / Heart) with DotScreen + TiltShift.',
    tags: ['MotionPath', 'Curves', 'Effects'],
    preview: { type: 'image', path: '/thumbs/motionpathcontrols.webp' },
    icon: Route,
    accent: '#fb923c',
    category: 'example',
  },
  {
    key: 'cell-fracture',
    group: 'motion',
    name: 'Cell Fracture',
    subtitle: 'Animated Fragments',
    desc: 'Click the "hello" text to trigger a Blender cell-fracture animation with MeshNormalMaterial fragments.',
    tags: ['Animation', 'Fragments', 'Click'],
    preview: { type: 'image', path: '/thumbs/cell-fracture.webp' },
    icon: Smile,
    accent: '#c084fc',
    category: 'example',
  },
  {
    key: 'clouds',
    group: 'motion',
    name: 'Volumetric Clouds',
    subtitle: 'Drei Cloud Composition',
    desc: 'Stacked Drei <Cloud> particles inside a rotating <Clouds> group with red/white spotlight tinting.',
    tags: ['Clouds', 'Lighting', 'Volumetric'],
    preview: { type: 'image', path: '/thumbs/clouds.webp' },
    icon: Cloud,
    accent: '#e2e8f0',
    category: 'example',
  },
  {
    key: 'night-train',
    group: 'motion',
    name: 'Night Train',
    subtitle: 'Merged Cabins + Scroll',
    desc: 'Five cabins of merged instanced seats scrolled into view with a reflective floor under fog.',
    tags: ['Merged', 'Instancing', 'ScrollControls', 'Reflections'],
    preview: { type: 'image', path: '/thumbs/night-train.webp' },
    icon: Train,
    accent: '#94a3b8',
    category: 'example',
  },
  // ── Interaction & spring ──────────────────────────────
  {
    key: 'floating-laptop',
    group: 'interaction',
    name: 'Floating Laptop',
    subtitle: 'react-spring + Hinge',
    desc: 'Click the MacBook to open the hinge — react-spring drives the animation, background, and hinge angle.',
    tags: ['react-spring', 'Interaction', 'GLTF'],
    preview: { type: 'image', path: '/thumbs/floating-laptop.webp' },
    icon: Laptop,
    accent: '#d25578',
    category: 'example',
  },
  {
    key: 'bouncy-watch',
    group: 'interaction',
    name: 'Bouncy Watch',
    subtitle: 'PresentationControls',
    desc: 'Snap-rotation watch model with HTML annotation overlay using Drei PresentationControls + Html.',
    tags: ['PresentationControls', 'Html', 'Spring'],
    preview: { type: 'image', path: '/thumbs/bouncy-watch.webp' },
    icon: Watch,
    accent: '#fde68a',
    category: 'example',
  },
  // ── Configurators (state-driven) ──────────────────────
  {
    key: 'shoe-configurator',
    group: 'configurator',
    name: 'Shoe Configurator',
    subtitle: 'Per-Material Color Picker',
    desc: 'Click a shoe part to bring up a HexColorPicker — valtio state, per-material colors, custom SVG cursors.',
    tags: ['Configurator', 'Valtio', 'ColorPicker'],
    preview: { type: 'image', path: '/thumbs/shoe-configurator.webp' },
    icon: Footprints,
    accent: '#fb923c',
    category: 'example',
  },
  {
    key: 't-shirt-configurator',
    group: 'configurator',
    name: 'T-Shirt Configurator',
    subtitle: 'Decals + Color',
    desc: 'Color palette + brand decal selector over a baked t-shirt with AccumulativeShadows and framer-motion overlay.',
    tags: ['Configurator', 'Decal', 'FramerMotion', 'Valtio'],
    preview: { type: 'image', path: '/thumbs/t-shirt-configurator.webp' },
    icon: Shirt,
    accent: '#EFBD4E',
    category: 'example',
  },
  {
    key: 'react-spring-animations',
    group: 'interaction',
    name: 'React Spring Switch',
    subtitle: 'Mixed DOM + 3D Spring',
    desc: 'Single shared react-spring value drives DOM background, h1 color, 3D sphere position and light color.',
    tags: ['react-spring', 'Interaction', 'DOM+3D'],
    preview: { type: 'image', path: '/thumbs/react-spring-animations.webp' },
    icon: ToggleRight,
    accent: '#7fffd4',
    category: 'example',
  },
  // ── Utility primitives ────────────────────────────────
  {
    key: 'viewcube',
    group: 'utility',
    name: 'ViewCube',
    subtitle: 'HUD Overlay',
    desc: 'Interactive orientation gizmo rendered via RenderTexture face labels in a Hud layer.',
    tags: ['HUD', 'Overlay', 'RenderTexture'],
    preview: { type: 'geometry', shape: 'torus' },
    icon: Box,
    accent: '#22d3ee',
    category: 'example',
  },
  {
    key: 'edgesgeometry',
    group: 'utility',
    name: 'Edges & Outlines',
    subtitle: 'Crease Lines',
    desc: 'Aluminium bracket with Drei Edges + Outlines on hover for technical-drawing-style overlays.',
    tags: ['Edges', 'Outlines', 'AccumulativeShadows'],
    preview: { type: 'image', path: '/thumbs/edgesgeometry.webp' },
    icon: HexIcon,
    accent: '#cbd5e1',
    category: 'example',
  },
  {
    key: 'gltf-reuse',
    group: 'utility',
    name: 'GLTF Reuse',
    subtitle: 'Instanced Rendering',
    desc: 'Efficient geometry and material reuse with mirrored instancing of a shoe model.',
    tags: ['Instancing', 'Performance', 'Cloning'],
    preview: { type: 'model', path: '/shoe.gltf' },
    icon: Copy,
    accent: '#fb923c',
    category: 'example',
  },
  // ── Custom (not from r3f docs) ────────────────────────
  {
    key: 'porsche-showcase',
    name: 'Porsche 911',
    subtitle: 'Showcase & Freeform',
    desc: 'Dual camera modes — automated orbital showcase and unlocked freeform orbit controls.',
    tags: ['Camera', 'OrbitControls', 'Interactive'],
    preview: { type: 'model', path: '/911-transformed.glb' },
    icon: Eye,
    accent: '#a78bfa',
    category: 'custom',
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
}: GalleryProps) {
  const scenesRef = useRef<HTMLDivElement>(null)
  const [activeGroup, setActiveGroup] = useState<Group | null>(null)

  /* group counts */
  const exampleScenes = scenes.filter((s) => s.category === 'example')
  const groupCounts = GROUPS.map((g) => ({
    ...g,
    count: exampleScenes.filter((s) => s.group === g.key).length,
  })).filter((g) => g.count > 0)
  const filteredExamples = activeGroup ? exampleScenes.filter((s) => s.group === activeGroup) : exampleScenes

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
              <a
                href="#/configurator"
                className="px-7 py-3 rounded-full border border-white/[0.08] text-sm font-medium text-white/60 hover:bg-white/[0.04] hover:text-white/90 hover:border-white/[0.14] transition-all"
              >
                Configurator
              </a>
            </div>
            <div className="flex items-center gap-10 pt-3 max-lg:justify-center">
              {[
                { n: String(scenes.filter((s) => s.category === 'example').length), l: 'Examples' },
                { n: String(scenes.filter((s) => s.category === 'custom').length), l: 'Custom' },
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

      {/* ── Examples grid ────────────────────────────── */}
      <section ref={scenesRef} className="relative px-6 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white/90">Examples</h2>
              <p className="text-sm text-white/25 mt-1.5">Faithful R3F reconstructions</p>
            </div>
            <span className="text-[11px] text-white/15 uppercase tracking-widest font-medium">
              {activeGroup ? `${filteredExamples.length} of ${exampleScenes.length}` : `${exampleScenes.length} demos`}
            </span>
          </div>

          {/* filter chips */}
          <div className="flex flex-wrap items-center gap-1.5 mb-10">
            <FilterChip
              active={activeGroup === null}
              onClick={() => setActiveGroup(null)}
              label="All"
              count={exampleScenes.length}
            />
            {groupCounts.map((g) => (
              <FilterChip
                key={g.key}
                active={activeGroup === g.key}
                onClick={() => setActiveGroup(activeGroup === g.key ? null : g.key)}
                label={g.label}
                count={g.count}
              />
            ))}
          </div>

          {activeGroup ? (
            /* flat filtered grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredExamples.map((scene, i) => (
                <SceneCard
                  key={scene.key}
                  scene={scene}
                  previewMode={previewMode}
                  href={`#/scene/${scene.key}`}
                  index={i}
                />
              ))}
            </div>
          ) : (
            /* grouped sections */
            <div className="space-y-14">
              {groupCounts.map((g) => {
                const items = exampleScenes.filter((s) => s.group === g.key)
                return (
                  <div key={g.key}>
                    <div className="flex items-baseline justify-between mb-5">
                      <div className="flex items-baseline gap-3">
                        <h3 className="text-lg font-semibold text-white/80">{g.label}</h3>
                        <span className="text-[11px] text-white/25 tracking-wide">{g.desc}</span>
                      </div>
                      <span className="text-[10px] text-white/20 uppercase tracking-widest">
                        {g.count} demo{g.count !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {items.map((scene, i) => (
                        <SceneCard
                          key={scene.key}
                          scene={scene}
                          previewMode={previewMode}
                          href={`#/scene/${scene.key}`}
                          index={i}
                        />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── Custom grid ──────────────────────────────── */}
      <section className="relative px-6 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white/90">Custom</h2>
              <p className="text-sm text-white/25 mt-1.5">Modified scenes & experiments</p>
            </div>
            <span className="text-[11px] text-white/15 uppercase tracking-widest font-medium">
              {scenes.filter((s) => s.category === 'custom').length} demo{scenes.filter((s) => s.category === 'custom').length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scenes
              .filter((s) => s.category === 'custom')
              .map((scene, i) => (
                <SceneCard
                  key={scene.key}
                  scene={scene}
                  previewMode={previewMode}
                  href={`#/scene/${scene.key}`}
                  index={i}
                />
              ))}
          </div>

          {/* Configurator banner */}
          <div className="mt-12">
            <ConfiguratorBanner
              previewMode={previewMode}
              href="#/configurator"
            />
          </div>
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
   Filter chip (group filter)
   ═══════════════════════════════════════════════════════ */

function FilterChip({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean
  onClick: () => void
  label: string
  count: number
}) {
  return (
    <button
      onClick={onClick}
      className={`group inline-flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-full text-[12px] font-medium transition-all duration-200 border ${
        active
          ? 'bg-white/[0.10] text-white border-white/[0.18] shadow-[0_0_24px_-6px_rgba(255,255,255,0.18)]'
          : 'bg-white/[0.02] text-white/55 border-white/[0.06] hover:text-white/85 hover:bg-white/[0.05] hover:border-white/[0.12]'
      }`}
    >
      {label}
      <span
        className={`min-w-5 text-center text-[10px] font-semibold tabular-nums rounded-full px-1.5 py-0.5 ${
          active ? 'bg-white/[0.18] text-white' : 'bg-white/[0.05] text-white/40 group-hover:bg-white/[0.08]'
        }`}
      >
        {count}
      </span>
    </button>
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
  href,
  index,
}: {
  scene: SceneInfo
  previewMode: '3d' | 'image'
  href: string
  index: number
}) {
  const cardRef = useRef<HTMLAnchorElement>(null)
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
    <a
      ref={cardRef}
      href={href}
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
        {scene.preview.type === 'image' ? (
          <img
            src={scene.preview.path}
            alt={scene.name}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : previewMode === '3d' && visible ? (
          <ModelPreview
            modelPath={scene.preview.type === 'model' ? scene.preview.path : undefined}
            geometry={scene.preview.type === 'geometry' ? scene.preview.shape : undefined}
            className="w-full h-full"
            accent={scene.accent}
            icon={scene.icon}
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
    </a>
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
  href,
}: {
  previewMode: '3d' | 'image'
  href: string
}) {
  const { ref, visible } = useInView()

  return (
    <a
      href={href}
      className="group block w-full rounded-2xl border border-white/[0.05] bg-gradient-to-br from-white/[0.025] to-white/[0.005] overflow-hidden text-left transition-all duration-300 hover:border-white/[0.10] hover:shadow-[0_24px_80px_-20px_rgba(0,0,0,0.6)] animate-in fade-in slide-in-from-bottom-3"
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
    </a>
  )
}
