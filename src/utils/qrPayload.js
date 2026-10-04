// Builds the exact string encoded into the QR code for each supported type.

export const EMPTY_FIELDS = {
  url: { url: '' },
  text: { text: '' },
  email: { address: '', subject: '', message: '' },
  phone: { phone: '' },
  wifi: { ssid: '', password: '', security: 'WPA', hidden: false },
}

/** Adds https:// when the user typed "example.com". */
export function normalizeUrl(value) {
  const trimmed = value.trim()
  return /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
}

/** Keeps digits and a single leading "+", dropping spaces, dashes and brackets. */
export function cleanPhone(value) {
  const trimmed = value.trim()
  const digits = trimmed.replace(/\D/g, '')
  return trimmed.startsWith('+') ? `+${digits}` : digits
}

/** Wi-Fi payload fields must escape \ ; , : and " (ZXing Wi-Fi format). */
export function escapeWifi(value) {
  return value.replace(/([\\;,:"])/g, '\\$1')
}

export function buildPayload(type, f) {
  switch (type) {
    case 'url':
      return normalizeUrl(f.url)
    case 'text':
      return f.text
    case 'email': {
      const params = []
      if (f.subject.trim()) params.push(`subject=${encodeURIComponent(f.subject.trim())}`)
      if (f.message.trim()) params.push(`body=${encodeURIComponent(f.message.trim())}`)
      return `mailto:${f.address.trim()}${params.length ? `?${params.join('&')}` : ''}`
    }
    case 'phone':
      return `tel:${cleanPhone(f.phone)}`
    case 'wifi': {
      const open = f.security === 'nopass'
      const password = open ? '' : `P:${escapeWifi(f.password)};`
      return `WIFI:T:${open ? 'nopass' : f.security};S:${escapeWifi(f.ssid)};${password}${f.hidden ? 'H:true;' : ''};`
    }
    default:
      return ''
  }
}

/** Short readable label used in history cards and file names. */
export function describePayload(type, f) {
  const raw = { url: f.url, text: f.text, email: f.address, phone: f.phone, wifi: f.ssid }[type] || ''
  return raw.trim()
}

export function fileNameFor(type, f, ext) {
  const slug = describePayload(type, f)
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 30)
  return `qr-${type}${slug ? `-${slug}` : ''}.${ext}`
}
