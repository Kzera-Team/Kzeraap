import type { BackupExporter, BackupFile } from '../../application/backup/BackupExportUseCase';

export class BrowserBackupExporter implements BackupExporter {
  async exportEncrypted(file: BackupFile): Promise<void> {
    const blob = new Blob([file.encryptedPayload], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.filename;
    link.rel = 'noopener';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }
}
