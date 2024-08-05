// image-storage.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ImageStorageService {
  private dbName = 'imageDB';
  private storeName = 'images';

  constructor() {
    this.openDB();
  }

  private openDB() {
    const request = indexedDB.open(this.dbName, 1);
    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(this.storeName)) {
        db.createObjectStore(this.storeName, { keyPath: 'id' });
      }
    };
    request.onerror = (event: any) => console.error('Error opening IndexedDB:', event);
  }

  async setFile(file: File): Promise<void> {
    const db = await this.openDBPromise();
    const transaction = db.transaction(this.storeName, 'readwrite');
    const store = transaction.objectStore(this.storeName);
    store.put({ id: 'savedImage', file });
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = (event: any) => reject('Error saving image to IndexedDB');
    });
  }

  async getFile(): Promise<File | null> {
    const db = await this.openDBPromise();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, 'readonly');
      const store = transaction.objectStore(this.storeName);
      const getRequest = store.get('savedImage');
      getRequest.onsuccess = (event: any) => {
        const result = event.target.result;
        resolve(result ? result.file : null);
      };
      getRequest.onerror = (event: any) => reject('Error retrieving image from IndexedDB');
    });
  }

  async clearFile(): Promise<void> {
    const db = await this.openDBPromise();
    const transaction = db.transaction(this.storeName, 'readwrite');
    const store = transaction.objectStore(this.storeName);
    store.delete('savedImage');
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = (event: any) => reject('Error removing image from IndexedDB');
    });
  }

  private openDBPromise(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName);
      request.onsuccess = (event: any) => resolve(event.target.result);
      request.onerror = (event: any) => reject('Error opening IndexedDB');
    });
  }
}
