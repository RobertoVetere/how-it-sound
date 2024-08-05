// image-storage.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ImageStorageService {
  private storageKey = 'savedImage';

  setFile(file: File) {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        localStorage.setItem(this.storageKey, reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

  getFile(): File | null {
    const savedImage = localStorage.getItem(this.storageKey);
    if (savedImage) {
      const byteString = atob(savedImage.split(',')[1]);
      const mimeString = savedImage.split(',')[0].split(':')[1].split(';')[0];
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const uint8Array = new Uint8Array(arrayBuffer);
      for (let i = 0; i < byteString.length; i++) {
        uint8Array[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([uint8Array], { type: mimeString });
      return new File([blob], 'image.jpg', { type: mimeString });
    }
    return null;
  }

  clearFile() {
    localStorage.removeItem(this.storageKey);
  }
}