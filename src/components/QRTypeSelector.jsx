import { Link2, Type, Mail, Phone, Wifi } from 'lucide-react'

const OPTIONS = [
  { id: 'url', label: 'URL', Icon: Link2 },
  { id: 'text', label: 'Text', Icon: Type },
  { id: 'email', label: 'Email', Icon: Mail },
  { id: 'phone', label: 'Phone', Icon: Phone },
  { id: 'wifi', label: 'Wi-Fi', Icon: Wifi },
]

export default function QRTypeSelector({ type, onChange }) {
  return (
    <div className="type-grid" role="radiogroup" aria-label="QR code type">
      {OPTIONS.map(({ id, label, Icon }) => (
        <button
          key={id}
          type="button"
          role="radio"
          aria-checked={type === id}
          className={`type-btn ${type === id ? 'active' : ''}`}
          onClick={() => onChange(id)}
        >
          <Icon size={20} aria-hidden="true" />
          {label}
        </button>
      ))}
    </div>
  )
}
