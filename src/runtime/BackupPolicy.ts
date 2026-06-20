export interface BackupWindow {
  id: 'morning' | 'afternoon' | 'night' | string;
  label: string;
  hour: number;
  minute: number;
}

export interface BackupPolicy {
  windows: BackupWindow[];
  postponeMinutes: number;
  maxPostponesPerWindow: number;
  retentionDays: number;
}

export const DEFAULT_BACKUP_POLICY: BackupPolicy = {
  windows: [
    { id: 'morning', label: 'Manhã', hour: 7, minute: 0 },
    { id: 'afternoon', label: 'Tarde', hour: 15, minute: 0 },
    { id: 'night', label: 'Noite', hour: 23, minute: 0 }
  ],
  postponeMinutes: 20,
  maxPostponesPerWindow: 1,
  retentionDays: 3
};

export function backupWindowDate(now: Date, window: BackupWindow): Date {
  const date = new Date(now);
  date.setHours(window.hour, window.minute, 0, 0);
  return date;
}

export function backupWindowKey(now: Date, window: BackupWindow): string {
  const yyyy = String(now.getFullYear());
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}${mm}${dd}-${window.id}`;
}

export function backupFileName(now = new Date()): string {
  const random = crypto.getRandomValues(new Uint8Array(6));
  const hex = Array.from(random).map(byte => byte.toString(16).padStart(2, '0')).join('');
  const stamp = now.toISOString().replace(/[-:TZ.]/g, '').slice(0, 12);
  return `${hex}-${stamp}.dat`;
}
