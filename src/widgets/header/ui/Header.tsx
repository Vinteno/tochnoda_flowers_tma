import { Link } from '@tanstack/react-router'

export function Header() {
  return (
    <header className="flex items-center justify-between p-2">
      <Link to="/" className="font-serif text-2xl">
        Floris
      </Link>
    </header>
  )
}
