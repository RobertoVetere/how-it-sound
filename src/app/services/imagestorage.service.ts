// image-storage.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ImageStorageService {
  private file: File | null = null;

  setFile(file: File) {
    this.file = file;
  }

  getFile(): File | null {
    return this.file;
  }

  clearFile() {
    this.file = null;
  }
}
