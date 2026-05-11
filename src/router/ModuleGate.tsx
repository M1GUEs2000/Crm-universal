import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { MODULE_PREFERENCES_CHANGED } from '@/config/modulePreferences'
import { resolveAppModules } from '@/config/moduleRegistry'

function isModuleEnabled(moduleId: string) {
  return Boolean(resolveAppModules().find(module => module.id === moduleId && module.enabled))
}

export default function ModuleGate({ moduleId, children }: { moduleId: string; children: ReactNode }) {
  const [enabled, setEnabled] = useState(() => isModuleEnabled(moduleId))

  useEffect(() => {
    const refreshModule = () => setEnabled(isModuleEnabled(moduleId))

    window.addEventListener(MODULE_PREFERENCES_CHANGED, refreshModule)
    return () => window.removeEventListener(MODULE_PREFERENCES_CHANGED, refreshModule)
  }, [moduleId])

  if (!enabled) return <Navigate to="/" replace />

  return children
}
