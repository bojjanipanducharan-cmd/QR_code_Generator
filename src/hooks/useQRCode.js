import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'

/**
 * Draws the QR code onto a canvas whenever the payload or style changes.
 * The same canvas is used for preview and PNG export, so the file matches the preview.
 */
export function useQRCode(payload, enabled, { size, margin, ecl, fg, bg }) {
  const canvasRef = useRef(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !enabled) {
      setError('')
      return undefined
    }
    let cancelled = false
    QRCode.toCanvas(canvas, payload, {
      width: size,
      margin,
      errorCorrectionLevel: ecl,
      color: { dark: fg, light: bg },
    })
      .then(() => !cancelled && setError(''))
      .catch(() => !cancelled && setError('This content is too long for a QR code. Shorten it or lower the error correction level.'))
    return () => {
      cancelled = true
    }
  }, [payload, enabled, size, margin, ecl, fg, bg])

  const getSvg = () =>
    QRCode.toString(payload, { type: 'svg', width: size, margin, errorCorrectionLevel: ecl, color: { dark: fg, light: bg } })

  return { canvasRef, error, getSvg }
}
