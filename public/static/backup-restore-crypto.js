(() => {
  const RUNTIME_KEY = 'kzera-runtime:runtime_runtimeState';
  const BACKUP_CONTEXT = 'backup:v1';
  const PROBE_CONTEXT = 'runtime:probe';

  function bytes(values) {
    return new Uint8Array(values || []);
  }

  function runtimeLocal() {
    const raw = localStorage.getItem(RUNTIME_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  async function deriveKey(password, runtime) {
    const material = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']);
    return crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt: bytes(runtime.salt), iterations: runtime.iterations, hash: runtime.hash },
      material,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  async function packJson(value, context, key) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const input = new TextEncoder().encode(JSON.stringify(value));
    const aad = new TextEncoder().encode(context);
    const encrypted = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv, additionalData: aad }, key, input));
    return JSON.stringify({ alg: 'AES-256-GCM', iv: Array.from(iv), data: Array.from(encrypted) });
  }

  async function unpackJson(payload, context, key) {
    const parsed = JSON.parse(payload);
    const raw = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: bytes(parsed.iv), additionalData: new TextEncoder().encode(context) },
      key,
      bytes(parsed.data)
    );
    return JSON.parse(new TextDecoder().decode(new Uint8Array(raw)));
  }

  async function openBackup(file, password) {
    const envelope = JSON.parse(await file.text());
    const runtime = envelope.runtime || runtimeLocal();
    if (!runtime) throw new Error('Senha local não configurada para abrir este backup.');
    const key = await deriveKey(password, runtime);
    await unpackJson(runtime.probe, PROBE_CONTEXT, key);
    const payload = await unpackJson(envelope.encryptedPayload, BACKUP_CONTEXT, key);
    if (envelope.runtime && !runtimeLocal()) localStorage.setItem(RUNTIME_KEY, JSON.stringify(envelope.runtime));
    return { payload, key };
  }

  window.kzeraBackupCrypto = { packJson, openBackup };
})();
