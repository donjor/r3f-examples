/**
 * GLB model optimization script.
 *
 * Copies raw vehicle models from ../vone, optimizes them with gltf-transform,
 * and writes quality-tiered variants to public/models/.
 *
 * Usage: bun scripts/optimize-models.ts
 */

import { promises as fs } from 'fs'
import path from 'path'
import {
  NodeIO,
  Document,
  type Transform,
} from '@gltf-transform/core'
import {
  KHRDracoMeshCompression,
  KHRMeshQuantization,
  KHRTextureBasisu,
} from '@gltf-transform/extensions'
import {
  dedup,
  weld,
  simplify,
  textureCompress,
  resample,
  prune,
  quantize,
} from '@gltf-transform/functions'
import draco3d from 'draco3dgltf'
import { MeshoptSimplifier } from 'meshoptimizer'
import sharp from 'sharp'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type OptimizationTier = 'high' | 'med' | 'low'

interface TierConfig {
  simplifyRatio: number
  simplifyError: number
  maxTextureSize: number
  draco: boolean
  /** Draco quantization bits for position (lower = smaller, lossier) */
  dracoQuantBits: number
}

interface TierStats {
  size: number
  triangles: number
  vertices: number
}

// ---------------------------------------------------------------------------
// Vehicle sources
// ---------------------------------------------------------------------------

const VONE_BASE = path.resolve(import.meta.dir, '../../vone/data/uploads/models/vehicles')
const OUTPUT_BASE = path.resolve(import.meta.dir, '../public/models')

const VEHICLES: { slug: string; sourcePath: string }[] = [
  {
    slug: 'ford-mustang-gt',
    sourcePath: path.join(VONE_BASE, 'ford_mustang_gt_2025_15/2025 Ford Mustang 2.glb'),
  },
  {
    slug: 'ford-mustang-gt-2022',
    sourcePath: path.join(VONE_BASE, 'ford_mustang_gt_2022/Muestang TEST MM.glb'),
  },
  {
    slug: 'ford-ranger-sport',
    sourcePath: path.join(VONE_BASE, 'ford_ranger_sport_2025_1/Ford Ranger 2023 Working 2.glb'),
  },
  {
    slug: 'nissan-navara-gt',
    sourcePath: path.join(VONE_BASE, 'nissan_navara_gt_2024/Nissan Navara 2023 2.glb'),
  },
  {
    slug: 'nissan-navara-stx',
    sourcePath: path.join(VONE_BASE, 'nissan_navara_stx_2024_1/Nissan Navara 2023 2.glb'),
  },
  {
    slug: 'toyota-rav4',
    sourcePath: path.join(VONE_BASE, 'toyota_rav4_hybrid_e-four_2021_4/Toyota Rav4.glb'),
  },
  {
    slug: 'toyota-rav4-prime',
    sourcePath: path.join(VONE_BASE, 'toyota_rav4_prime_hybrid_e-four_2021_2/Toyota Rav4.glb'),
  },
  {
    slug: 'toyota-hilux-sr5',
    sourcePath: path.join(VONE_BASE, 'toyota_hilux_sr5_2026_15/2026 Hilux Test - Base Test.glb'),
  },
  {
    slug: 'toyota-hilux-sr5-no-roll',
    sourcePath: path.join(VONE_BASE, 'toyota_hilux_sr5_2026_13/2026 Hilux Test No Roll.glb'),
  },
]

// ---------------------------------------------------------------------------
// Tier presets
// ---------------------------------------------------------------------------

const TIER_CONFIGS: Record<OptimizationTier, TierConfig> = {
  high: { simplifyRatio: 1.0, simplifyError: 0.001, maxTextureSize: 2048, draco: true, dracoQuantBits: 14 },
  med:  { simplifyRatio: 0.35, simplifyError: 0.01, maxTextureSize: 1024, draco: true, dracoQuantBits: 11 },
  low:  { simplifyRatio: 0.15, simplifyError: 0.02, maxTextureSize: 512,  draco: true, dracoQuantBits: 9 },
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function countTriangles(doc: Document): number {
  let total = 0
  for (const mesh of doc.getRoot().listMeshes()) {
    for (const prim of mesh.listPrimitives()) {
      const indices = prim.getIndices()
      if (indices) {
        total += indices.getCount() / 3
      } else {
        const pos = prim.getAttribute('POSITION')
        if (pos) total += pos.getCount() / 3
      }
    }
  }
  return Math.round(total)
}

function countVertices(doc: Document): number {
  let total = 0
  for (const mesh of doc.getRoot().listMeshes()) {
    for (const prim of mesh.listPrimitives()) {
      const pos = prim.getAttribute('POSITION')
      if (pos) total += pos.getCount()
    }
  }
  return total
}


function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// ---------------------------------------------------------------------------
// Core optimization
// ---------------------------------------------------------------------------

async function processTier(
  io: NodeIO,
  inputPath: string,
  outputPath: string,
  tier: OptimizationTier,
): Promise<TierStats> {
  const config = TIER_CONFIGS[tier]
  const doc = await io.read(inputPath)

  const transforms: Transform[] = [
    dedup(),
    prune(),
    weld(),
  ]

  if (config.simplifyRatio < 1.0) {
    transforms.push(
      simplify({
        simplifier: MeshoptSimplifier,
        ratio: config.simplifyRatio,
        error: config.simplifyError,
      }),
    )
  }

  if (config.maxTextureSize < 4096) {
    transforms.push(
      textureCompress({
        encoder: sharp,
        targetFormat: 'webp',
        resize: [config.maxTextureSize, config.maxTextureSize],
      }),
    )
  }

  transforms.push(resample())

  // Quantize vertex attributes for better Draco compression
  transforms.push(quantize())

  await doc.transform(...transforms)

  if (config.draco) {
    doc
      .createExtension(KHRDracoMeshCompression)
      .setRequired(true)
      .setEncoderOptions({
        method: KHRDracoMeshCompression.EncoderMethod.EDGEBREAKER,
        encodeSpeed: 5,
        decodeSpeed: 5,
        quantizationBits: {
          POSITION: config.dracoQuantBits,
        },
      })
  }

  await io.write(outputPath, doc)

  const outBytes = await fs.readFile(outputPath)
  return {
    size: outBytes.length,
    triangles: countTriangles(doc),
    vertices: countVertices(doc),
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('Initializing WASM decoders...')

  const io = new NodeIO()
    .registerExtensions([
      KHRDracoMeshCompression,
      KHRMeshQuantization,
      KHRTextureBasisu,
    ])
    .registerDependencies({
      'draco3d.decoder': await draco3d.createDecoderModule(),
      'draco3d.encoder': await draco3d.createEncoderModule(),
    })

  await MeshoptSimplifier.ready

  for (const vehicle of VEHICLES) {
    console.log(`\n${'='.repeat(60)}`)
    console.log(`Processing: ${vehicle.slug}`)
    console.log(`Source: ${vehicle.sourcePath}`)

    // Verify source exists
    try {
      await fs.access(vehicle.sourcePath)
    } catch {
      console.error(`  SKIP — source file not found`)
      continue
    }

    const outDir = path.join(OUTPUT_BASE, vehicle.slug)
    await fs.mkdir(outDir, { recursive: true })

    try {
      // Get original stats
      const originalBytes = await fs.readFile(vehicle.sourcePath)
      const originalDoc = await io.read(vehicle.sourcePath)
      console.log(`  Original: ${formatBytes(originalBytes.length)} | ${countTriangles(originalDoc)} tris | ${countVertices(originalDoc)} verts`)

      // Process each tier
      for (const tier of ['high', 'med', 'low'] as OptimizationTier[]) {
        const outPath = path.join(outDir, `model.${tier}.glb`)
        try {
          console.log(`  Processing ${tier}...`)
          const stats = await processTier(io, vehicle.sourcePath, outPath, tier)
          console.log(`    ${tier}: ${formatBytes(stats.size)} | ${stats.triangles} tris | ${stats.vertices} verts`)
        } catch (err) {
          console.error(`    ${tier} FAILED:`, err instanceof Error ? err.message : err)
        }
      }
    } catch (err) {
      console.error(`  SKIP — failed to read model:`, err instanceof Error ? err.message : err)
    }
  }

  console.log('\nDone!')
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
