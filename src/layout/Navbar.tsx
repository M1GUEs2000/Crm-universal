import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { COMPANY_PREFERENCES_CHANGED, getSelectedCompany } from '@/config/companyPreferences'
import { appModules, findModuleByPath } from '@/config/moduleRegistry'

export default function Navbar() {
  const { pathname } = useLocation()
  const modulo = findModuleByPath(pathname) ?? appModules[0]
  const [company, setCompany] = useState(() => getSelectedCompany())

  useEffect(() => {
    const refreshCompany = () => setCompany(getSelectedCompany())

    window.addEventListener(COMPANY_PREFERENCES_CHANGED, refreshCompany)
    return () => window.removeEventListener(COMPANY_PREFERENCES_CHANGED, refreshCompany)
  }, [])

  return (
    <header className="h-16 bg-surface border-b border-border flex items-center justify-between gap-4 px-6 shrink-0">
      <h1 className="text-text font-medium">{modulo.label}</h1>
      <div className="text-right">
        <p className="text-sm font-medium text-text">{company.nombre}</p>
        <p className="text-xs text-text-muted">{company.ruc}</p>
      </div>
    </header>
  )
}
