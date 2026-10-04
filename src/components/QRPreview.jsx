import { Download, Copy, Save, FileImage, AlertTriangle } from 'lucide-react'

export default function QRPreview({ canvasRef, valid, error, warnings, onDownloadPng, onDownloadSvg, onCopy, onSave }) {
  const ready = valid && !error
  return (
    <div className="preview">
      <div className="qr-stage">
        <canvas ref={canvasRef} hidden={!ready} aria-label="Generated QR code preview" role="img" />
        {!ready && <p className="placeholder">{error || 'Fill in the form and your QR code appears here.'}</p>}
      </div>
      {ready && warnings.length > 0 && (
        <ul className="warnings" role="alert">
          {warnings.map((w) => (
            <li key={w}><AlertTriangle size={16} aria-hidden="true" /> {w}</li>
          ))}
        </ul>
      )}
      <div className="actions">
        <button className="btn primary" onClick={onDownloadPng} disabled={!ready}><Download size={18} /> Download PNG</button>
        <button className="btn" onClick={onDownloadSvg} disabled={!ready}><FileImage size={18} /> Download SVG</button>
        <button className="btn" onClick={onCopy} disabled={!ready}><Copy size={18} /> Copy content</button>
        <button className="btn" onClick={onSave} disabled={!ready}><Save size={18} /> Save to history</button>
      </div>
      <p className="hint center">Test every customized code with your phone before printing or sharing it.</p>
    </div>
  )
}
