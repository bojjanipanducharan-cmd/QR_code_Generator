import { RotateCcw } from 'lucide-react'
import PresetSelector from './PresetSelector.jsx'

const ECL = [
  ['L', 'L · 7% recovery'],
  ['M', 'M · 15% recovery'],
  ['Q', 'Q · 25% recovery'],
  ['H', 'H · 30% recovery'],
]

export default function QRCustomization({ settings, onChange, onPreset, onReset }) {
  const num = (name) => (e) => onChange({ [name]: Number(e.target.value) })
  return (
    <div className="customize">
      <h3>Style</h3>
      <PresetSelector fg={settings.fg} bg={settings.bg} onSelect={onPreset} />
      <div className="color-row">
        <label htmlFor="fg">Foreground
          <input id="fg" type="color" value={settings.fg} onChange={(e) => onChange({ fg: e.target.value })} />
        </label>
        <label htmlFor="bg">Background
          <input id="bg" type="color" value={settings.bg} onChange={(e) => onChange({ bg: e.target.value })} />
        </label>
      </div>
      <div className="field">
        <label htmlFor="size">Size: {settings.size}px</label>
        <input id="size" type="range" min="160" max="512" step="8" value={settings.size} onChange={num('size')} />
      </div>
      <div className="field">
        <label htmlFor="margin">Margin: {settings.margin} modules</label>
        <input id="margin" type="range" min="1" max="10" value={settings.margin} onChange={num('margin')} />
      </div>
      <div className="field">
        <label htmlFor="ecl">Error correction</label>
        <select id="ecl" value={settings.ecl} onChange={(e) => onChange({ ecl: e.target.value })}>
          {ECL.map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
        <p className="hint">Higher levels survive more damage but make a denser code.</p>
      </div>
      <button type="button" className="btn ghost" onClick={onReset}>
        <RotateCcw size={16} /> Reset to default
      </button>
    </div>
  )
}
