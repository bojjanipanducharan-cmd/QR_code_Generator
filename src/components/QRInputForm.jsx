/** Renders the inputs for the selected type. Errors appear only once showErrors is true. */
function Field({ id, label, error, hint, children }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {children}
      {hint && !error && <p className="hint">{hint}</p>}
      {error && (
        <p className="error" id={`${id}-error`} role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export default function QRInputForm({ type, values, errors, showErrors, onChange, onBlur }) {
  const set = (name) => (e) => onChange(name, e.target.type === 'checkbox' ? e.target.checked : e.target.value)
  const err = (name) => (showErrors ? errors[name] : '')
  const common = (name) => ({
    id: name,
    onBlur,
    'aria-invalid': Boolean(err(name)),
    'aria-describedby': err(name) ? `${name}-error` : undefined,
  })

  switch (type) {
    case 'url':
      return (
        <Field id="url" label="Website URL" error={err('url')} hint="https:// is added automatically if you leave it out.">
          <input {...common('url')} type="text" inputMode="url" placeholder="https://example.com" value={values.url} onChange={set('url')} />
        </Field>
      )
    case 'text':
      return (
        <Field id="text" label="Text" error={err('text')}>
          <textarea {...common('text')} rows={4} placeholder="Anything you want people to read after scanning" value={values.text} onChange={set('text')} />
        </Field>
      )
    case 'email':
      return (
        <>
          <Field id="address" label="Email address" error={err('address')}>
            <input {...common('address')} type="email" placeholder="name@example.com" value={values.address} onChange={set('address')} />
          </Field>
          <Field id="subject" label="Subject (optional)">
            <input id="subject" type="text" value={values.subject} onChange={set('subject')} />
          </Field>
          <Field id="message" label="Message (optional)">
            <textarea id="message" rows={3} value={values.message} onChange={set('message')} />
          </Field>
        </>
      )
    case 'phone':
      return (
        <Field id="phone" label="Phone number" error={err('phone')} hint="Include the country code, like +91 98765 43210.">
          <input {...common('phone')} type="tel" placeholder="+91 98765 43210" value={values.phone} onChange={set('phone')} />
        </Field>
      )
    case 'wifi':
      return (
        <>
          <Field id="ssid" label="Network name (SSID)" error={err('ssid')}>
            <input {...common('ssid')} type="text" autoComplete="off" value={values.ssid} onChange={set('ssid')} />
          </Field>
          <Field id="security" label="Security">
            <select id="security" value={values.security} onChange={set('security')}>
              <option value="WPA">WPA / WPA2 / WPA3</option>
              <option value="WEP">WEP</option>
              <option value="nopass">No password (open network)</option>
            </select>
          </Field>
          {values.security !== 'nopass' && (
            <Field id="password" label="Password" error={err('password')}>
              <input {...common('password')} type="text" autoComplete="off" value={values.password} onChange={set('password')} />
            </Field>
          )}
          <label className="check">
            <input type="checkbox" checked={values.hidden} onChange={set('hidden')} />
            Hidden network
          </label>
        </>
      )
    default:
      return null
  }
}
