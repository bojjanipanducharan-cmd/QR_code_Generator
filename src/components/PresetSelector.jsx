import { PRESETS } from '../utils/presets.js'

export default function PresetSelector({ fg, bg, onSelect }) {
  return (
    <div className="preset-grid">
      {PRESETS.map((p) => {
        const active = p.fg === fg && p.bg === bg
        return (
          <button key={p.id} type="button" className={`preset ${active ? 'active' : ''}`} aria-pressed={active} onClick={() => onSelect(p)}>
            <span className="swatch" style={{ background: p.bg }} aria-hidden="true">
              <i style={{ background: p.fg }} />
            </span>
            {p.name}
          </button>
        )
      })}
    </div>
  )
}
