import { Link } from '@tanstack/react-router'

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between bg-background px-2 pb-2 safe-area-top">
      <Link to="/">
        <img src="/logo.png" alt="Точно Да" className="h-10 w-auto" />
      </Link>
    </header>
  )
}
