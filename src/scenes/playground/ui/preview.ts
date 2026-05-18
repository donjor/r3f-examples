/** Visual preview surface shown inside picker cards.
 *  - image: static webp/png thumb from /thumbs/
 *  - model: a glTF rendered via <ModelPreview> spinning slowly
 *  - swatch: small text/gradient tile for entries with no natural visual (drei presets, "None") */
export type TemplatePreview =
  | { type: 'image'; path: string }
  | { type: 'model'; path: string }
  | { type: 'swatch'; label?: string; gradient?: string }
