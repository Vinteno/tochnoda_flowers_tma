import { Outlet } from '@tanstack/react-router'
import { Header } from '@widgets/header'

export function PageLayout() {
  return (
    <main className="flex min-h-dvh flex-col safe-area-top">
      <Header />
      <div className="flex flex-1 flex-col">
        <Outlet />
      </div>
    </main>
  )
}
