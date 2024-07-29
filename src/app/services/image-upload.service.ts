import { Injectable } from '@angular/core';
import imageCompression from 'browser-image-compression';

@Injectable({
  providedIn: 'root',
})
export class ImageProcessingService {

  async compressImage(file: File): Promise<string> {
    const options = {
       maxSizeMB: 1,
    maxWidthOrHeight: 2000, 
    useWebWorker: true,
    initialQuality: 1
    };

    try {
      const compressedFile = await imageCompression(file, options);
      return await this.readFileAsDataURL(compressedFile);
    } catch (error) {
      console.error('Error compressing image:', error);
      throw error;
    }
  }

  private readFileAsDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e: any) => resolve(e.target.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }
}
