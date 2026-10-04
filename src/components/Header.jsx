import { Moon, Sun } from 'lucide-react'

export function Logo() {
  return (
    <svg width="34" height="34" viewBox="0 0 32 32" aria-hidden="true">
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4f46e5" />
          <stop offset="1" stopColor="#0891b2" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#lg)" />
      <path fill="#fff" d="M7 7h8v8H7zM17 7h8v8h-8zM7 17h8v8H7zM17 17h4v4h-4zM21 21h4v4h-4z" />
      <path fill="#4f46e5" d="M9.5 9.5h3v3h-3zM19.5 9.5h3v3h-3zM9.5 19.5h3v3h-3z" />
    </svg>
  )
}

export default function Header({ theme, onToggleTheme }) {
  return (
    <header className="header">
      <div className="container header-inner">
        <a className="brand" href="#generator">
          <Logo />
          <span>QR Studio</span>
        </a>
        <nav aria-label="Main">
          <a href="#generator">Generator</a>
          <a href="#history">History</a>
          <a href="#about">About</a>
        </nav>
        <button
          className="icon-btn"
          onClick={onToggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </header>
  )
}
