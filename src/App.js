import { lazy, Suspense, useState } from 'react'
import { Leva } from 'leva'

const scenes = {
  'lambo-envmaps': { name: 'Lambo EnvMaps', component: lazy(() => import('./scenes/lambo-envmaps')) },
  'porsche-live-envmaps': { name: 'Porsche Live EnvMaps', component: lazy(() => import('./scenes/porsche-live-envmaps')) },
  'porsche-ground-projection': { name: 'Porsche Ground Projection', component: lazy(() => import('./scenes/porsche-ground-projection')) },
  'datsun-ssgi': { name: 'Datsun SSGI', component: lazy(() => import('./scenes/datsun-ssgi')) },
  'env-transitions': { name: 'Env Transitions', component: lazy(() => import('./scenes/env-transitions')) },
  'viewcube': { name: 'ViewCube HUD', component: lazy(() => import('./scenes/viewcube')) },
  'gltf-reuse': { name: 'GLTF Reuse', component: lazy(() => import('./scenes/gltf-reuse')) },
}

export default function App() {
  const [active, setActive] = useState(null)
  const Scene = active ? scenes[active].component : null

  if (active) {
    return (
      <>
        <Leva collapsed />
        <button className="back-button" onClick={() => setActive(null)}>
          ← Back
        </button>
        <Suspense fallback={<div className="loading">Loading...</div>}>
          <Scene key={active} />
        </Suspense>
      </>
    )
  }

  return (
    <>
      <Leva hidden />
      <div className="selector">
        <h1>R3F Examples</h1>
        <div className="grid">
          {Object.entries(scenes).map(([key, { name }]) => (
            <button key={key} className="card" onClick={() => setActive(key)}>
              {name}
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
