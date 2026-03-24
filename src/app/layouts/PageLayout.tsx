import { Outlet } from '@tanstack/react-router'

export function PageLayout() {
  return (
    <main className="flex min-h-dvh flex-col safe-area-top safe-area-bottom">
      <div className="flex flex-1 flex-col">
        <Outlet />
      </div>
    </main>
  )
}
