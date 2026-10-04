import { describe, it, expect } from 'vitest'
import { buildPayload, EMPTY_FIELDS, escapeWifi, fileNameFor } from './qrPayload.js'
import { validate } from './validation.js'
import { contrastRatio } from './contrast.js'

describe('buildPayload', () => {
  it('adds https to bare domains', () => {
    expect(buildPayload('url', { url: 'example.com' })).toBe('https://example.com')
  })
  it('builds mailto with encoded params', () => {
    const p = buildPayload('email', { address: 'a@b.com', subject: 'Hi there', message: 'x&y' })
    expect(p).toBe('mailto:a@b.com?subject=Hi%20there&body=x%26y')
  })
  it('builds tel with cleaned number', () => {
    expect(buildPayload('phone', { phone: '+91 (987) 65-43210' })).toBe('tel:+919876543210')
  })
  it('builds and escapes wifi payload', () => {
    expect(buildPayload('wifi', { ssid: 'My;Net', password: 'p:w', security: 'WPA', hidden: true })).toBe('WIFI:T:WPA;S:My\\;Net;P:p\\:w;H:true;;')
    expect(buildPayload('wifi', { ssid: 'Open', password: '', security: 'nopass', hidden: false })).toBe('WIFI:T:nopass;S:Open;;')
  })
  it('escapes backslashes', () => expect(escapeWifi('a\\b')).toBe('a\\\\b'))
  it('creates readable file names', () => {
    expect(fileNameFor('url', { url: 'https://Example.com/a b' }, 'png')).toBe('qr-url-example-com-a-b.png')
  })
})

describe('validate', () => {
  it('accepts valid input', () => {
    expect(validate('url', { url: 'https://example.com' })).toEqual({})
    expect(validate('email', { ...EMPTY_FIELDS.email, address: 'a@b.co' })).toEqual({})
    expect(validate('phone', { phone: '+1 555 123 4567' })).toEqual({})
  })
  it('rejects bad input', () => {
    expect(validate('url', { url: '' }).url).toBeTruthy()
    expect(validate('url', { url: 'not a url' }).url).toBeTruthy()
    expect(validate('text', { text: '   ' }).text).toBeTruthy()
    expect(validate('email', { ...EMPTY_FIELDS.email, address: 'nope' }).address).toBeTruthy()
    expect(validate('phone', { phone: 'abc123' }).phone).toBeTruthy()
    expect(validate('wifi', { ...EMPTY_FIELDS.wifi }).ssid).toBeTruthy()
    expect(validate('wifi', { ssid: 'x', password: 'short', security: 'WPA', hidden: false }).password).toBeTruthy()
  })
})

describe('contrast', () => {
  it('black on white is 21:1', () => expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 0))
})
