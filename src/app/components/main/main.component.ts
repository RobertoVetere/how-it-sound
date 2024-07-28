import { Component, ElementRef, Renderer2 } from '@angular/core';
import { ChatService } from '../../services/chat.service'; 
import { CommonModule } from '@angular/common';
import { DeezerService } from '../../services/deezer.service';
import { RouterLink } from '@angular/router';
import { LoaderComponent } from '../loader/loader.component';
import { LoaderService } from '../../services/loader.service';
import { MusicFilterComponent } from '../music-filter/music-filter.component';
import { ImageData } from '../../models/image.data';
import { SongData } from '../../models/song.data';
import imageCompression from 'browser-image-compression';


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
  constructor(private chatService: ChatService, private loaderService: LoaderService, private deezerService: DeezerService,
    private renderer: Renderer2,
    private elementRef: ElementRef) {
      this.loaderService.loading$.subscribe((loading) => {
      this.loading = loading;
    });
  }
  
  imageData: ImageData = { src: 'djs.jpg', file: null };
  imageNotComp: ImageData = { src: 'djs.jpg', file: null };
  songData: SongData = { title: '', author: '', description: '', link: '', colors: [] };
  objectResult: Object | undefined;
  songInfo: boolean = false;
  apiKey: string = '';
  colors: string[] = [];
  loading: boolean = false;
  apiCallsLeft: number = 3;

 async onFileSelected(event: any) {
  const file: File = event.target.files[0];
  if (file) {
    try {
      const options = {
        maxSizeMB: 0.1, // Reducir el tamaño máximo en MB para comprimir más
        maxWidthOrHeight: 800, // Reducir el ancho o altura máxima
        useWebWorker: true, // Usar Web Worker para mejorar el rendimiento
        initialQuality: 0.5 // Reducir la calidad inicial (de 0 a 1) para comprimir más
      };

      // Cargar imagen no comprimida
      this.imageNotComp.file = file;
      const readerNotComp = new FileReader();
      readerNotComp.onload = (e: any) => {
        this.imageNotComp.src = e.target.result;
      };
      readerNotComp.readAsDataURL(file);

      // Comprimir imagen
      const compressedFile = await imageCompression(file, options);
      this.imageData.file = compressedFile;
      const readerComp = new FileReader();
      readerComp.onload = (e: any) => {
        this.imageData.src = e.target.result;
      };
      readerComp.readAsDataURL(compressedFile);
    } catch (error) {
      console.error('Error compressing image:', error);
    }
  }
}




  triggerFileInput(fileInput: HTMLInputElement) {
    fileInput.click();
  }

  async showHowItSound() {
    if (!this.imageNotComp.file) {
      alert('Debe seleccionar una imagen.');
      return;
    }
    if (!localStorage.getItem('apiKey')) {
      alert('Añade tu clave Api de OpenAi');
      return;
    }

    this.loaderService.show();
    try {
      await this.analizeImage();
    } catch (error) {
      console.error('Error al analizar la imagen:', error);
    } finally {
      
    }
  }

  uploadImage() {
    alert("imagen subida");
  }

  closeModal() {
    this.songInfo = false; 
    document.querySelector('main')?.classList.remove('bg-gradient-animation');
  }

  searchSong(songAuthor: string, songTitle: string) {
  this.deezerService.findSongOnDeezer(songAuthor, songTitle).subscribe({
    next: (link: string) => {
      console.log(link);
      this.songData.link = link; // Asigna el enlace de la canción a la variable 'songLink'
      this.audioPlayer = document.getElementById('audioPlayer') as HTMLAudioElement;

      if (this.audioPlayer) {
        this.audioPlayer.src = this.songData.link; // Establece el enlace de la canción
        this.audioPlayer.load(); // Carga la nueva fuente de audio

        // Espera a que el audio esté listo para reproducir
        this.audioPlayer.addEventListener('canplaythrough', () => {
          this.audioPlayer!.loop = true;
          this.audioPlayer!.volume = 0.5;
          this.audioPlayer!.play(); // Comienza la reproducción
          this.applyGradientBackground();
        }, { once: true });

        this.audioPlayer.addEventListener('pause', () => {
          document.querySelector('main')?.classList.remove('bg-gradient-animation');
        });
        this.audioPlayer.addEventListener('play', () => {
          document.querySelector('main')?.classList.add('bg-gradient-animation');
        });
      }
      this.loaderService.hide();
    },
    error: (error) => {
      console.error('Error al buscar canción en Deezer:', error.message);
      alert(error.message);
      this.clearAudioPlayer();
      /*
      if (this.apiCallsLeft > 0) {
        this.analizeImage().then(() => {
          this.apiCallsLeft -= 1;
          console.log("quedan: " + this.apiCallsLeft + " intentos");
        }).catch(err => {
          console.error('Error al analizar la imagen:', err);
          alert("¡Ups! Algo ha salido mal, prueba de nuevo");
        });
      } else {
        alert("¡Ups! Algo ha salido mal, prueba de nuevo");
      }
        */
    }
  });
}


  private applyGradientBackground() {
    const gradient = `linear-gradient(-45deg, ${this.colors.join(', ')})`;
    document.querySelector('main')?.style, 'background', gradient;
    document.querySelector('main')?.classList.add('bg-gradient-animation');
    
  }
  private removeGradientBackground() {
    const mainElement = this.elementRef.nativeElement.querySelector('main');
    if (mainElement) {
      this.renderer.setStyle(mainElement, 'background', '');
      mainElement.classList.remove('bg-gradient-animation');
    }
  }
  private clearAudioPlayer() {
    if (this.audioPlayer) {
      this.audioPlayer.pause();
      this.audioPlayer.src = '';
      this.audioPlayer.load();
    }
  }

  async analizeImage() {
    if (!this.imageData.file) {
      throw new Error('No image file selected');
    }

    try {
      const result = await this.chatService.analyzeTextWithImage(this.imageData.file);
      this.songData = {
        title: result.title,
        author: result.authorSong,
        description: result.description,
        link: '',
        colors: result.colors
      };
      this.colors = result.colors; // Guardar colores para el gradiente
      this.searchSong(this.songData.author, this.songData.title);
      this.songInfo = true;
      
    } catch (error) {
      console.error('Error al analizar la imagen:', error);
      throw error; // Vuelve a lanzar el error para que sea manejado en showHowItSound
    }
  }


  
}





