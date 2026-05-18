import ModelPreview from '@/components/ModelPreview'
import type { TemplatePreview } from './preview'

interface PreviewTileProps {
  preview: TemplatePreview
  /** When true the tile mounts a live 3D <ModelPreview>; otherwise model previews fall back to a placeholder. */
  live?: boolean
  accent?: string
  className?: string
}

/** Single thumbnail surface used inside picker cards. Renders one of:
 *  image (lazy <img>), live ModelPreview (heavier), or a gradient swatch. */
export function PreviewTile({ preview, live = false, accent = '#64748b', className = '' }: PreviewTileProps) {
  if (preview.type === 'image') {
    return (
      <img
        src={preview.path}
        alt=""
        loading="lazy"
        className={`absolute inset-0 w-full h-full object-cover ${className}`}
      />
    )
  }
  if (preview.type === 'model') {
    if (live) {
      return (
        <div className={`absolute inset-0 ${className}`}>
          <ModelPreview modelPath={preview.path} accent={accent} rotationSpeed={0.5} quality="low" />
        </div>
      )
    }
    return <SwatchSurface gradient={`radial-gradient(circle at 50% 40%, ${accent}22 0%, #0c0c10 70%)`} label="3D" className={className} />
  }
  return (
    <SwatchSurface
      gradient={preview.gradient ?? `linear-gradient(180deg, ${accent}66 0%, #0c0c10 100%)`}
      label={preview.label}
      className={className}
    />
  )
}

function SwatchSurface({ gradient, label, className = '' }: { gradient: string; label?: string; className?: string }) {
  return (
    <div
      className={`absolute inset-0 flex items-center justify-center ${className}`}
      style={{ background: gradient }}
    >
      {label && (
        <span className="text-[10px] uppercase tracking-[0.18em] text-white/40 font-semibold">{label}</span>
      )}
    </div>
  )
}
