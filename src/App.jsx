import { useEffect, useMemo, useState, useCallback } from 'react'
import Header from './components/Header.jsx'
import QRTypeSelector from './components/QRTypeSelector.jsx'
import QRInputForm from './components/QRInputForm.jsx'
import QRCustomization from './components/QRCustomization.jsx'
import QRPreview from './components/QRPreview.jsx'
import QRHistory from './components/QRHistory.jsx'
import Toast from './components/Toast.jsx'
import { useLocalStorage } from './hooks/useLocalStorage.js'
import { useQRCode } from './hooks/useQRCode.js'
import { EMPTY_FIELDS, buildPayload, fileNameFor } from './utils/qrPayload.js'
import { validate } from './utils/validation.js'
import { getScanWarnings } from './utils/contrast.js'
import { DEFAULT_SETTINGS } from './utils/presets.js'

const HISTORY_LIMIT = 20

function download(href, name) {
  const a = document.createElement('a')
  a.href = href
  a.download = name
  a.click()
}

export default function App() {
  const [theme, setTheme] = useLocalStorage('qr-theme', window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  const [history, setHistory, storageError] = useLocalStorage('qr-history', [])
  const [type, setType] = useState('url')
  const [fields, setFields] = useState(EMPTY_FIELDS)
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [showErrors, setShowErrors] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  const notify = useCallback((message, kind = 'success') => setToast({ message, kind, id: Date.now() }), [])
  useEffect(() => {
    if (!toast) return undefined
    const t = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(t)
  }, [toast])

  const current = fields[type]
  const errors = useMemo(() => validate(type, current), [type, current])
  const valid = Object.keys(errors).length === 0
  const payload = useMemo(() => (valid ? buildPayload(type, current) : ''), [valid, type, current])
  const { canvasRef, error, getSvg } = useQRCode(payload, valid, settings)
  const warnings = useMemo(() => getScanWarnings(settings), [settings])

  const changeField = (name, value) => setFields((f) => ({ ...f, [type]: { ...f[type], [name]: value } }))
  const changeType = (next) => {
    setType(next)
    setShowErrors(false)
  }
  const changeSettings = (patch) => setSettings((s) => ({ ...s, ...patch }))

  // One entry per unique (payload + style). Saving again moves it to the top instead of duplicating it.
  const saveToHistory = (silent) => {
    const entry = { id: crypto.randomUUID(), type, fields: current, payload, settings, createdAt: Date.now() }
    setHistory((prev) => {
      const rest = prev.filter((h) => !(h.payload === payload && JSON.stringify(h.settings) === JSON.stringify(settings)))
      return [entry, ...rest].slice(0, HISTORY_LIMIT)
    })
    if (!silent) notify('Saved to history.')
  }

  // Every action that needs a valid code goes through this guard.
  const guard = (action) => () => {
    if (!valid || error) {
      setShowErrors(true)
      notify('Fix the highlighted fields first.', 'error')
      return
    }
    action()
  }

  const downloadPng = guard(() => {
    canvasRef.current.toBlob((blob) => {
      if (!blob) return notify('Could not create the PNG.', 'error')
      const url = URL.createObjectURL(blob)
      download(url, fileNameFor(type, current, 'png'))
      setTimeout(() => URL.revokeObjectURL(url), 1000)
      saveToHistory(true)
      notify('PNG downloaded.')
    }, 'image/png')
  })

  const downloadSvg = guard(async () => {
    try {
      const svg = await getSvg()
      const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }))
      download(url, fileNameFor(type, current, 'svg'))
      setTimeout(() => URL.revokeObjectURL(url), 1000)
      notify('SVG downloaded.')
    } catch {
      notify('Could not create the SVG.', 'error')
    }
  })

  const copyContent = guard(async () => {
    try {
      await navigator.clipboard.writeText(payload)
      notify('QR content copied to clipboard.')
    } catch {
      notify('Copy was blocked by the browser.', 'error')
    }
  })

  const reuse = (item) => {
    setType(item.type)
    setFields((f) => ({ ...f, [item.type]: item.fields }))
    setSettings(item.settings)
    setShowErrors(false)
    document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' })
    notify('Loaded from history.')
  }

  return (
    <>
      <Header theme={theme} onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />
      <main>
        <section id="generator" className="container hero">
          <h1>Create Your Perfect QR Code</h1>
          <p className="lead">Pick a type, style it, and download a QR code that works. Everything runs in your browser, nothing is uploaded.</p>
        </section>

        <div className="container workspace">
          <section className="card" aria-label="QR code settings">
            <QRTypeSelector type={type} onChange={changeType} />
            <QRInputForm type={type} values={current} errors={errors} showErrors={showErrors} onChange={changeField} onBlur={() => setShowErrors(true)} />
            <QRCustomization
              settings={settings}
              onChange={changeSettings}
              onPreset={(p) => changeSettings({ fg: p.fg, bg: p.bg })}
              onReset={() => setSettings(DEFAULT_SETTINGS)}
            />
          </section>
          <section className="card sticky" aria-label="QR code preview">
            <QRPreview
              canvasRef={canvasRef}
              valid={valid}
              error={error}
              warnings={warnings}
              onDownloadPng={downloadPng}
              onDownloadSvg={downloadSvg}
              onCopy={copyContent}
              onSave={guard(() => saveToHistory(false))}
            />
          </section>
        </div>

        {storageError && <p className="container banner" role="alert">{storageError}</p>}
        <QRHistory
          items={history}
          onReuse={reuse}
          onDelete={(id) => setHistory((h) => h.filter((x) => x.id !== id))}
          onClear={() => { setHistory([]); notify('History cleared.') }}
        />

        <section id="about" className="container section about">
          <h2>About QR Studio</h2>
          <p>QR Studio builds QR codes entirely in your browser with the open-source qrcode library. Your content never leaves your device, and history is kept only in this browser&apos;s local storage.</p>
          <p>Custom colors can make a code harder to scan. The preview warns about low contrast, small sizes and thin margins, but no code is guaranteed to scan, so test it with a phone.</p>
        </section>
      </main>
      <Toast toast={toast} />
    </>
  )
}
