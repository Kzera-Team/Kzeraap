(() => {
  function openDb(name, version, stores) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(name, version);
      request.onupgradeneeded = () => {
        const db = request.result;
        for (const store of stores) {
          if (!db.objectStoreNames.contains(store)) db.createObjectStore(store, { keyPath: 'id' });
        }
      };
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  function putAll(db, storeName, records) {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      for (const record of records || []) store.put(record);
      tx.onerror = () => reject(tx.error);
      tx.oncomplete = () => resolve();
    });
  }

  window.kzeraBackupDb = { openDb, putAll };
})();
