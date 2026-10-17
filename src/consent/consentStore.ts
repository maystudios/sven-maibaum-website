import { useSyncExternalStore } from "react";

/**
 * The visitor's consent per category, kept in localStorage under one key.
 * Storing the choice itself is strictly necessary (§ 25 Abs. 2 Nr. 2 TDDDG);
 * the record holds no identifier and never leaves the device.
 *
 * `null` for a category means "not asked yet". Raising CONSENT_VERSION (when
 * the categories or vendors change) or a record older than CONSENT_MAX_AGE_DAYS
 * asks the visitor again.
 */
export const CONSENT_VERSION = 1;
export const CONSENT_MAX_AGE_DAYS = 365;
const STORAGE_KEY = "consent";

export type ConsentCategory = "statistics" | "externalMedia";
export type ConsentDecisions = Record<ConsentCategory, boolean>;

export type ConsentRecord = {
  version: number;
  /** ISO timestamp of the last change */
  updatedAt: string;
  statistics: boolean | null;
  externalMedia: boolean | null;
};

/** Whether the reopened settings are showing, and which element to return focus to. */
type SettingsState = { open: boolean; opener: HTMLElement | null; openCount: number };

const listeners = new Set<() => void>();
let record: ConsentRecord | null = readRecord();
let settings: SettingsState = { open: false, opener: null, openCount: 0 };

function decision(value: unknown): boolean | null {
  return typeof value === "boolean" ? value : null;
}

function readRecord(): ConsentRecord | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ConsentRecord>;
    const age = Date.now() - Date.parse(parsed.updatedAt ?? "");
    if (parsed.version !== CONSENT_VERSION || !(age < CONSENT_MAX_AGE_DAYS * 86_400_000)) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return {
      version: CONSENT_VERSION,
      updatedAt: parsed.updatedAt as string,
      statistics: decision(parsed.statistics),
      externalMedia: decision(parsed.externalMedia),
    };
  } catch (error) {
    console.warn("[consent] The stored choice could not be read; the banner asks again.", error);
    return null;
  }
}

function emit() {
  listeners.forEach((listener) => listener());
}

function writeRecord(decisions: Pick<ConsentRecord, ConsentCategory>) {
  record = { version: CONSENT_VERSION, updatedAt: new Date().toISOString(), ...decisions };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  } catch (error) {
    console.warn("[consent] The choice could not be stored; it applies to this page view only.", error);
  }
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

if (typeof window !== "undefined") {
  // A choice changed in another tab applies here too.
  window.addEventListener("storage", (event) => {
    if (event.key !== STORAGE_KEY && event.key !== null) return;
    record = readRecord();
    emit();
  });
}

/** True while at least one category has not been decided. */
export function needsAnswer(current: ConsentRecord | null) {
  return current === null || current.statistics === null || current.externalMedia === null;
}

export function saveConsent(decisions: ConsentDecisions) {
  writeRecord(decisions);
}

/** Consent given by the Steam placeholder; leaves the statistics decision untouched. */
export function grantExternalMedia() {
  writeRecord({ statistics: record?.statistics ?? null, externalMedia: true });
}

/** Reopens the banner with the settings expanded; focus returns to `opener` on close. */
export function openConsentSettings(opener: HTMLElement | null) {
  settings = { open: true, opener, openCount: settings.openCount + 1 };
  emit();
}

/** Closes the banner; returns whether focus went back to the element that reopened it. */
export function closeConsentSettings() {
  const { opener } = settings;
  settings = { ...settings, open: false, opener: null };
  emit();
  if (!opener?.isConnected) return false;
  opener.focus();
  return true;
}

export function useConsent() {
  return useSyncExternalStore(subscribe, () => record, () => null);
}

export function useConsentSettings() {
  return useSyncExternalStore(subscribe, () => settings, () => settings);
}
