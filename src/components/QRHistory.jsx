import { useState } from 'react'
import { Trash2, RotateCcw, X } from 'lucide-react'
import { describePayload } from '../utils/qrPayload.js'

const LABELS = { url: 'URL', text: 'Text', email: 'Email', phone: 'Phone', wifi: 'Wi-Fi' }

export default function QRHistory({ items, onReuse, onDelete, onClear }) {
  const [confirming, setConfirming] = useState(false)
  return (
    <section id="history" className="container section" aria-labelledby="history-title">
      <div className="section-head">
        <h2 id="history-title">Recent QR codes</h2>
        {items.length > 0 &&
          (confirming ? (
            <span className="confirm" role="alertdialog" aria-label="Confirm clear history">
              Delete all {items.length}?
              <button className="btn danger" onClick={() => { onClear(); setConfirming(false) }}>Yes, clear</button>
              <button className="btn ghost" onClick={() => setConfirming(false)}><X size={16} /> Cancel</button>
            </span>
          ) : (
            <button className="btn ghost" onClick={() => setConfirming(true)}>Clear history</button>
          ))}
      </div>
      {items.length === 0 ? (
        <p className="empty">Nothing saved yet. Save a code or download it and it shows up here.</p>
      ) : (
        <ul className="history-grid">
          {items.map((item) => (
            <li key={item.id} className="history-card">
              <span className="chip">{LABELS[item.type]}</span>
              <p className="history-content" title={item.payload}>{describePayload(item.type, item.fields) || item.payload}</p>
              <div className="history-meta">
                <span className="dot" style={{ background: item.settings.fg, outline: `2px solid ${item.settings.bg}` }} aria-hidden="true" />
                {new Date(item.createdAt).toLocaleString()}
              </div>
              <div className="history-actions">
                <button className="btn" onClick={() => onReuse(item)}><RotateCcw size={16} /> Reuse</button>
                <button className="icon-btn" onClick={() => onDelete(item.id)} aria-label={`Delete ${LABELS[item.type]} entry`}><Trash2 size={18} /></button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
