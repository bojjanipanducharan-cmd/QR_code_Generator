import { useCallback, useState } from 'react'

/** useState that persists to localStorage. Never throws: storage can be blocked or full. */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key)
      return raw ? JSON.parse(raw) : initialValue
    } catch {
      return initialValue
    }
  })
  const [storageError, setStorageError] = useState('')

  const update = useCallback(
    (next) => {
      setValue((prev) => {
        const resolved = typeof next === 'function' ? next(prev) : next
        try {
          window.localStorage.setItem(key, JSON.stringify(resolved))
          setStorageError('')
        } catch {
          setStorageError('Browser storage is unavailable, so changes will not survive a refresh.')
        }
        return resolved
      })
    },
    [key],
  )

  return [value, update, storageError]
}
