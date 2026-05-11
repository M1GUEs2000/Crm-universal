import { crmConfig } from './crm.config'

const STORAGE_KEY = 'crm-universal:selected-company'

export const COMPANY_PREFERENCES_CHANGED = 'crm:company-preferences-changed'

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

export function getSelectedCompanyId() {
  if (!canUseStorage()) return crmConfig.defaultCompanyId

  return window.localStorage.getItem(STORAGE_KEY) ?? crmConfig.defaultCompanyId
}

export function setSelectedCompanyId(companyId: string) {
  if (!canUseStorage()) return

  window.localStorage.setItem(STORAGE_KEY, companyId)
  window.dispatchEvent(new Event(COMPANY_PREFERENCES_CHANGED))
}

export function getSelectedCompany() {
  const selectedId = getSelectedCompanyId()

  return crmConfig.companies.find(company => company.id === selectedId)
    ?? crmConfig.companies.find(company => company.id === crmConfig.defaultCompanyId)
    ?? crmConfig.companies[0]
}
