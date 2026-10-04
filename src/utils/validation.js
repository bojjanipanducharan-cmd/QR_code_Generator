import { normalizeUrl, cleanPhone } from './qrPayload.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function isValidUrl(value) {
  try {
    const url = new URL(normalizeUrl(value))
    const okProtocol = url.protocol === 'http:' || url.protocol === 'https:'
    return okProtocol && (url.hostname.includes('.') || url.hostname === 'localhost')
  } catch {
    return false
  }
}

/** Returns an object of { fieldName: message }. Empty object = valid. */
export function validate(type, f) {
  const errors = {}
  switch (type) {
    case 'url':
      if (!f.url.trim()) errors.url = 'Enter a URL, for example https://example.com.'
      else if (!isValidUrl(f.url)) errors.url = 'This does not look like a valid web address.'
      break
    case 'text':
      if (!f.text.trim()) errors.text = 'Enter some text to encode.'
      break
    case 'email':
      if (!f.address.trim()) errors.address = 'Enter an email address.'
      else if (!EMAIL_RE.test(f.address.trim())) errors.address = 'Enter a valid email, like name@example.com.'
      break
    case 'phone':
      if (!f.phone.trim()) errors.phone = 'Enter a phone number.'
      else if (!/^\+?\d{7,15}$/.test(cleanPhone(f.phone)) || /[^\d\s()+.-]/.test(f.phone))
        errors.phone = 'Use 7 to 15 digits. A leading + is allowed.'
      break
    case 'wifi':
      if (!f.ssid.trim()) errors.ssid = 'Enter the network name (SSID).'
      if (f.security !== 'nopass') {
        if (!f.password) errors.password = 'Enter the password, or choose "No password".'
        else if (f.security === 'WPA' && f.password.length < 8) errors.password = 'WPA passwords need at least 8 characters.'
      }
      break
    default:
      errors.type = 'Unknown QR type.'
  }
  return errors
}
