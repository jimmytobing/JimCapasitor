import { Capacitor } from '@capacitor/core'
import { SecureStorage } from '@aparajita/capacitor-secure-storage'

const SALESFORCE_STORAGE_PREFIX = 'jimcapasitor_salesforce_'

let secureStorageReady = false

function canUseWebStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function isNativeStoragePreferred() {
  return Capacitor.isNativePlatform()
}

async function ensureSecureStorageReady() {
  if (!isNativeStoragePreferred() || secureStorageReady) return
  await SecureStorage.setKeyPrefix(SALESFORCE_STORAGE_PREFIX)
  secureStorageReady = true
}

export async function readSalesforceStorage(key) {
  if (isNativeStoragePreferred()) {
    await ensureSecureStorageReady()
    const value = await SecureStorage.get(key, false)
    return typeof value === 'string' ? value : null
  }

  if (!canUseWebStorage()) return null
  return window.localStorage.getItem(`${SALESFORCE_STORAGE_PREFIX}${key}`)
}

export async function writeSalesforceStorage(key, value) {
  if (isNativeStoragePreferred()) {
    await ensureSecureStorageReady()
    await SecureStorage.set(key, value, false)
    return
  }

  if (!canUseWebStorage()) return
  window.localStorage.setItem(`${SALESFORCE_STORAGE_PREFIX}${key}`, value)
}

export async function clearSalesforceStorage(key) {
  if (isNativeStoragePreferred()) {
    await ensureSecureStorageReady()
    await SecureStorage.remove(key)
    return
  }

  if (!canUseWebStorage()) return
  window.localStorage.removeItem(`${SALESFORCE_STORAGE_PREFIX}${key}`)
}
