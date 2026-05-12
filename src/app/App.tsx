import { Suspense } from 'react'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'sonner'
import { router } from '@/router'
import { Spinner } from '@/components/ui'

export default function App() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-background"><Spinner size="lg" /></div>}>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors closeButton />
    </Suspense>
  )
}
