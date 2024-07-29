import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';
import { ImageProcessingService } from '../services/image-upload.service';

@Directive({
  selector: '[appDefaultImg]',
  standalone: true,
})
export class DefaultImgDirective implements OnChanges {
  @Input() appDefaultImg: File | null = null; // Usa el mismo nombre del selector
  @Input() placeholder: string = 'assets/placeholder.png'; // Ruta a la imagen placeholder

  constructor(
    private imageProcessingService: ImageProcessingService,
    private imageRef: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['appDefaultImg']) {
      this.loadImage();
    }
  }

  private async loadImage() {
    if (this.appDefaultImg) {
      this.setPlaceholder();
      try {
        const compressedImage = await this.imageProcessingService.compressImage(this.appDefaultImg);
        this.setImage(compressedImage);
      } catch (error) {
        console.error('Error compressing image:', error);
        this.setPlaceholder();
      }
    } else {
      this.setPlaceholder();
    }
  }

  private setPlaceholder() {
    this.renderer.setAttribute(this.imageRef.nativeElement, 'src', this.placeholder);
  }

  private setImage(src: string) {
    this.renderer.setAttribute(this.imageRef.nativeElement, 'src', src);
  }
}
