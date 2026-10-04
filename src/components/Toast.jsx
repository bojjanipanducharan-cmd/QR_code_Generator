import { CheckCircle2, AlertCircle } from 'lucide-react'

/** Live region: screen readers announce messages without moving focus. */
export default function Toast({ toast }) {
  return (
    <div className="toast-region" role="status" aria-live="polite">
      {toast && (
        <div className={`toast ${toast.kind}`}>
          {toast.kind === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
          {toast.message}
        </div>
      )}
    </div>
  )
}
