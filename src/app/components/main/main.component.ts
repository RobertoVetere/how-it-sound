import { Component, ElementRef, Renderer2 } from '@angular/core';
import { ChatService } from '../../services/chat.service'; 
import { CommonModule } from '@angular/common';
import { DeezerService } from '../../services/deezer.service';
import { RouterLink } from '@angular/router';
import { LoaderComponent } from '../loader/loader.component';
import { LoaderService } from '../../services/loader.service';
import { MusicFilterComponent } from '../music-filter/music-filter.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, RouterLink, LoaderComponent, MusicFilterComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
saveToGallery() {
throw new Error('Method not implemented.');
}

  audioPlayer: HTMLAudioElement | null = null;

  constructor(
    private chatService: ChatService, 
    private loaderService: LoaderService, 
    private deezerService: DeezerService,
    private renderer: Renderer2,
    private elementRef: ElementRef
  ) {
    this.loaderService.loading$.subscribe((loading) => {
      this.loading = loading;
    });
  }

  imageSrc: string = 'djs.jpg';
  selectedFile: File | null = null;
  songTitle: string = '';
  songDescription: string = '';
  songAuthor: string = '';
  songInfo: boolean = false;
  songLink: string = '';
  colors: string[] = [];
  loading: boolean = false;

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file; // Almacenar el archivo seleccionado
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageSrc = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  triggerFileInput(fileInput: HTMLInputElement) {
    fileInput.click();
  }

  async showHowItSound() {
    if (!this.selectedFile) {
      alert('Debe seleccionar una imagen.');
      return;
    }
    if (!localStorage.getItem('apiKey')) {
      alert('Añade tu clave API de OpenAI');
      return;
    }

    this.loaderService.show();

    try {
      if (this.selectedFile) {
        const objectResult = await this.chatService.analyzeTextWithImage(this.selectedFile);
        this.songTitle = objectResult.title ?? ''; 
        this.songDescription = objectResult.description ?? ''; 
        this.colors = objectResult.colors ?? []; 
        this.songAuthor = objectResult.authorSong ?? ''; 
        await this.searchSong(this.songAuthor, this.songTitle);
        this.songInfo = true;
        this.applyGradientBackground(); // Aplicar fondo gradiente después de cargar los colores
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error al analizar la imagen:', error.message);
      } else {
        console.error('Error desconocido:', error);
      }
    } finally {
      // Ocultar loader después de completar la operación
      this.loaderService.hide();
    }
  }

  uploadImage() {
    alert("Imagen subida");
  }

  closeModal() {
    this.songInfo = false; 
    document.querySelector('main')?.classList.remove('bg-gradient-animation');
  }

  private async searchSong(songAuthor: string, songTitle: string): Promise<void> {
    try {
      const link = await this.deezerService.findSongOnDeezer(songAuthor, songTitle).toPromise();
      if (link) {
        this.songLink = link;
        this.playAudio(); // Solo llama a playAudio si link es válido
      } else {
        console.error('No se encontró enlace para la canción');
        this.songLink = ''; // Asegura que songLink sea un string
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error al buscar canción en Deezer:', error.message);
      } else {
        console.error('Error desconocido al buscar canción:', error);
      }
      this.songLink = ''; // Asegura que songLink sea un string
      this.loaderService.hide();
    }
  }

  private playAudio() {
    this.audioPlayer = document.getElementById('audioPlayer') as HTMLAudioElement;

    if (this.audioPlayer && this.songLink) { 
      this.audioPlayer.src = this.songLink;
      this.audioPlayer.load();
      this.audioPlayer.loop = true;
      this.audioPlayer.volume = 0.5;
      this.audioPlayer.play();
      this.audioPlayer.addEventListener('pause', () => {
        this.removeGradientBackground();
      });
      this.audioPlayer.addEventListener('play', () => {
        this.applyGradientBackground();
      });
    } else {
      console.error('Reproductor de audio no disponible o enlace de canción no definido');
    }
  }

  private applyGradientBackground() {
    const gradient = `linear-gradient(-45deg, ${this.colors.join(', ')})`;
    document.querySelector('main')?.style.setProperty('background', gradient);
    document.querySelector('main')?.classList.add('bg-gradient-animation');
  }

  private removeGradientBackground() {
    this.renderer.setStyle(this.elementRef.nativeElement.querySelector('main'), 'background', '');
    document.querySelector('body')?.classList.remove('bg-gradient-animation');
  }
}