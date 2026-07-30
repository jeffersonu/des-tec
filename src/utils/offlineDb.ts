export interface OfflineSubmission {
  id?: number;
  timestamp: number;
  data: any;
}

const DB_NAME = 'destec-offline-db';
const DB_VERSION = 1;
const STORE_NAME = 'contact-submissions';

export function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    };
    
    request.onsuccess = (event: any) => {
      resolve(event.target.result);
    };
    
    request.onerror = (event: any) => {
      reject(event.target.error);
    };
  });
}

export async function saveOfflineSubmission(data: any): Promise<number> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const submission: OfflineSubmission = {
      timestamp: Date.now(),
      data
    };
    const request = store.add(submission);
    
    request.onsuccess = (event: any) => {
      resolve(event.target.result);
    };
    
    request.onerror = (event: any) => {
      reject(event.target.error);
    };
  });
}

export async function getOfflineSubmissions(): Promise<OfflineSubmission[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();
    
    request.onsuccess = (event: any) => {
      resolve(event.target.result);
    };
    
    request.onerror = (event: any) => {
      reject(event.target.error);
    };
  });
}

export async function deleteOfflineSubmission(id: number): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);
    
    request.onsuccess = () => {
      resolve();
    };
    
    request.onerror = (event: any) => {
      reject(event.target.error);
    };
  });
}
