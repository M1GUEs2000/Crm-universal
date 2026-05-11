import type { ModuleVisibility } from './crm.config'

const STORAGE_KEY = 'crm-universal:module-visibility'

export const MODULE_PREFERENCES_CHANGED = 'crm:module-preferences-changed'

type ModuleVisibilityMap = Record<string, ModuleVisibility>

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function readStoredVisibilities(): ModuleVisibilityMap {
  if (!canUseStorage()) return {}

  try {
    const value = window.localStorage.getItem(STORAGE_KEY)
    return value ? JSON.parse(value) as ModuleVisibilityMap : {}
  } catch {
    return {}
  }
}

function writeStoredVisibilities(visibilities: ModuleVisibilityMap) {
  if (!canUseStorage()) return

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(visibilities))
  window.dispatchEvent(new Event(MODULE_PREFERENCES_CHANGED))
}

export function getStoredModuleVisibilities() {
  return readStoredVisibilities()
}

export function getStoredModuleVisibility(moduleId: string) {
  return readStoredVisibilities()[moduleId]
}

export function setStoredModuleVisibility(moduleId: string, visibility: ModuleVisibility) {
  writeStoredVisibilities({
    ...readStoredVisibilities(),
    [moduleId]: visibility,
  })
}

export function resetStoredModuleVisibilities() {
  if (!canUseStorage()) return

  window.localStorage.removeItem(STORAGE_KEY)
  window.dispatchEvent(new Event(MODULE_PREFERENCES_CHANGED))
}
