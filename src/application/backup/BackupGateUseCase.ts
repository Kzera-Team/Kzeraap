import { backupWindowDate, backupWindowKey, DEFAULT_BACKUP_POLICY, type BackupPolicy, type BackupWindow } from '../../runtime/BackupPolicy';

export interface BackupStatus {
  lastBackupAt?: string;
  completedWindowKey?: string;
  pendingWindowAt?: string;
  pendingWindowKey?: string;
  pendingWindowLabel?: string;
  postponedUntil?: string;
  postponesUsed: number;
}

export interface BackupDecision {
  required: boolean;
  canPostpone: boolean;
  blocked: boolean;
  nextAction: 'none' | 'backup' | 'backup_or_postpone';
  status: BackupStatus;
  window?: BackupWindow;
}

function findDueWindow(policy: BackupPolicy, now: Date): BackupWindow | undefined {
  return [...policy.windows]
    .sort((a, b) => backupWindowDate(now, b).getTime() - backupWindowDate(now, a).getTime())
    .find(window => now.getTime() >= backupWindowDate(now, window).getTime());
}

export class BackupGateUseCase {
  constructor(private readonly policy = DEFAULT_BACKUP_POLICY) {}

  evaluate(inputStatus: BackupStatus, now = new Date()): BackupDecision {
    const status: BackupStatus = { ...inputStatus, postponesUsed: inputStatus.postponesUsed ?? 0 };

    if (status.pendingWindowKey && status.completedWindowKey !== status.pendingWindowKey && status.pendingWindowAt) {
      const pendingAt = new Date(status.pendingWindowAt);
      if (Number.isFinite(pendingAt.getTime()) && now.getTime() >= pendingAt.getTime()) {
        const pendingId = status.pendingWindowKey.split('-').slice(1).join('-');
        const pendingWindow = this.policy.windows.find(window => window.id === pendingId);
        const postponedUntil = status.postponedUntil ? new Date(status.postponedUntil) : null;
        const postponementActive = Boolean(postponedUntil && now.getTime() < postponedUntil.getTime());

        if (postponementActive) {
          return pendingWindow
            ? { required: false, canPostpone: false, blocked: false, nextAction: 'none', status, window: pendingWindow }
            : { required: false, canPostpone: false, blocked: false, nextAction: 'none', status };
        }

        const canPostpone = status.postponesUsed < this.policy.maxPostponesPerWindow;
        const decision: BackupDecision = {
          required: true,
          canPostpone,
          blocked: !canPostpone,
          nextAction: canPostpone ? 'backup_or_postpone' : 'backup',
          status
        };
        if (pendingWindow) decision.window = pendingWindow;
        return decision;
      }
    }

    const dueWindow = findDueWindow(this.policy, now);

    if (!dueWindow) {
      return { required: false, canPostpone: false, blocked: false, nextAction: 'none', status };
    }

    // Usuário novo: nunca fez backup e nunca teve janela concluída — iniciar ciclo pela próxima janela.
    if (!status.lastBackupAt && !status.completedWindowKey) {
      return { required: false, canPostpone: false, blocked: false, nextAction: 'none', status, window: dueWindow };
    }

    const dueKey = backupWindowKey(now, dueWindow);
    if (status.completedWindowKey === dueKey) {
      return { required: false, canPostpone: false, blocked: false, nextAction: 'none', status, window: dueWindow };
    }

    const activeStatus: BackupStatus = status.pendingWindowKey === dueKey
      ? status
      : {
          ...status,
          pendingWindowKey: dueKey,
          pendingWindowAt: backupWindowDate(now, dueWindow).toISOString(),
          pendingWindowLabel: dueWindow.label,
          postponesUsed: 0
        };
    if (status.pendingWindowKey !== dueKey) delete activeStatus.postponedUntil;

    const postponedUntil = activeStatus.postponedUntil ? new Date(activeStatus.postponedUntil) : null;
    const postponementActive = Boolean(postponedUntil && now.getTime() < postponedUntil.getTime());

    if (postponementActive) {
      return { required: false, canPostpone: false, blocked: false, nextAction: 'none', status: activeStatus, window: dueWindow };
    }

    const canPostpone = activeStatus.postponesUsed < this.policy.maxPostponesPerWindow;
    return {
      required: true,
      canPostpone,
      blocked: !canPostpone,
      nextAction: canPostpone ? 'backup_or_postpone' : 'backup',
      status: activeStatus,
      window: dueWindow
    };
  }

  postpone(status: BackupStatus, now = new Date()): BackupStatus {
    if (status.postponesUsed >= this.policy.maxPostponesPerWindow) return status;
    return {
      ...status,
      postponesUsed: status.postponesUsed + 1,
      postponedUntil: new Date(now.getTime() + this.policy.postponeMinutes * 60_000).toISOString()
    };
  }

  complete(status: BackupStatus, now = new Date()): BackupStatus {
    const next: BackupStatus = {
      ...status,
      lastBackupAt: now.toISOString(),
      postponesUsed: 0
    };
    if (status.pendingWindowKey) next.completedWindowKey = status.pendingWindowKey;
    delete next.pendingWindowAt;
    delete next.pendingWindowKey;
    delete next.pendingWindowLabel;
    delete next.postponedUntil;
    return next;
  }
}
