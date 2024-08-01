import { Component, ElementRef, Renderer2, NgModule, OnDestroy } from '@angular/core';
import { ChatService } from '../../services/chat.service'; 
import { CommonModule } from '@angular/common';
import { DeezerService } from '../../services/deezer.service';
import { RouterLink } from '@angular/router';
import { LoaderComponent } from '../loader/loader.component';
import { LoaderService } from '../../services/loader.service';
import { MusicFilterComponent } from '../music-filter/music-filter.component';
import { ImageData } from '../../models/image.data';
import { SongData } from '../../models/song.data';
import { ImageProcessingService } from '../../services/image-upload.service';
import { DefaultImgDirective } from '../../directives/default-img.directive';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { LoadingOverlayComponent } from "../loading-overlay/loading-overlay.component";


@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, RouterLink, LoaderComponent, MusicFilterComponent, DefaultImgDirective, FormsModule, LoadingOverlayComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnDestroy {

  ngAfterViewInit() {
    this.cdr.detectChanges();
    this.audioPlayer = new Audio();
    if (this.audioPlayer) {
      this.audioPlayer.addEventListener('timeupdate', () => {
        this.currentTime = (this.audioPlayer!.currentTime / this.audioPlayer!.duration) * 100;
      });

      this.audioPlayer.addEventListener('loadedmetadata', () => {
        this.duration = this.audioPlayer!.duration;
      });
    }
  }

  ngOnDestroy() {
    this.clearAudioPlayer();
  if (this.audioPlayer) {
    this.audioPlayer.removeEventListener('timeupdate', this.updateTime);
    this.audioPlayer.removeEventListener('loadedmetadata', this.updateDuration);
  }
}

private updateTime = () => {
  this.currentTime = (this.audioPlayer!.currentTime / this.audioPlayer!.duration) * 100;
};

private updateDuration = () => {
  this.duration = this.audioPlayer!.duration;
};
saveToGallery() {
throw new Error('Method not implemented.');
}

  audioPlayer: HTMLAudioElement | null = null;
  constructor(private chatService: ChatService, private loaderService: LoaderService, private deezerService: DeezerService,
    private renderer: Renderer2,
    private elementRef: ElementRef,
  private imageProcessingService: ImageProcessingService,private cdr: ChangeDetectorRef ) {
      this.loaderService.loading$.subscribe((loading) => {
      this.loading = loading;
    });
  }
  currentTime: number = 0;
  duration: number = 0;
  imageData: ImageData = { src: 'djs.webp', file: null };
  imageNotComp: ImageData = { src: 'djs.webp', file: null };
  songData: SongData = { title: '', author: '', description: '', link: '', colors: [] };
  objectResult: Object | undefined;
  songInfo: boolean = false;
  apiKey: string = '';
  colors: string[] = [];
  loading: boolean = false;
  apiCallsLeft: number = 3;
  imageIsLoading = false;
  isPlaying: boolean = false;

 async onFileSelected(event: any) {
  const file: File = event.target.files[0];
  if (file) {
    try {
      await this.processImage(file);
    } catch (error) {
      console.error('Error processing image:', error);
    }
  }
}


  private async processImage(file: File) {
  try {
    this.imageData.src = await this.imageProcessingService.compressImage(file);
    this.imageData.file = file; // El archivo comprimido ya está en `src`
    this.cdr.detectChanges();
  } catch (error) {
    console.error('Error processing image:', error);
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



  triggerFileInput(fileInput: HTMLInputElement) {
    fileInput.click();
  }

  async showHowItSound() {
    this.clearAudioPlayer();
    if (!this.imageData.file) {
      alert('Debe seleccionar una imagen.');
      return;
    }
    if (!localStorage.getItem('apiKey')) {
      alert('Añade tu clave Api de OpenAi');
      return;
    }

    
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
    this.clearAudioPlayer();
    this.songInfo = false; 
    document.querySelector('main')?.classList.remove('bg-gradient-animation');
  }

  searchSong(songAuthor: string, songTitle: string) {
    this.deezerService.findSongOnDeezer(songAuthor, songTitle).subscribe({
      next: async (link: string) => {
        console.log(link);
        this.songData.link = link;
        if (this.audioPlayer) {
          this.audioPlayer.src = this.songData.link;
          this.audioPlayer.load();
          this.audioPlayer.loop = true;
          this.audioPlayer.volume = 0.5;
          await this.audioPlayer.play();
          this.isPlaying = true;
        }

        // Asegúrate de que el gradiente se aplique antes de mostrar la modal
        this.applyGradientBackground();

        // Muestra la modal después de aplicar el gradiente
        this.songInfo = true;
        this.loaderService.hide();
      },
      error: (error) => {
        console.error('Error al buscar canción en Deezer:', error.message);
        this.clearAudioPlayer();
        this.loaderService.hide();
        if (this.apiCallsLeft > 0) {
          this.analizeImage().then(() => {
            this.apiCallsLeft -= 1;
            console.log("quedan: " + this.apiCallsLeft + " intentos");
          }).catch(err => {
            alert("¡Ups! Algo ha salido mal, prueba de nuevo");
          });
        } else {
          alert("¡Ups! Algo ha salido mal, prueba de nuevo");
          this.loaderService.hide();
        }
      }
    });
  }
private setupAudioEvents() {
  if (this.audioPlayer) {
    this.audioPlayer.addEventListener('play', () => {
      this.applyGradientBackground();
    });
    this.audioPlayer.addEventListener('pause', () => {
      this.removeGradientBackground();
    });
  }
}

   private applyGradientBackground() {
    document.querySelector('main')?.classList.add('bg-gradient-animation');
    
  }

  private removeGradientBackground() {
    document.querySelector('main')?.classList.remove('bg-gradient-animation');
  }
  private clearAudioPlayer() {
    if (this.audioPlayer) {
      this.audioPlayer.pause();
      this.audioPlayer.src = '';
      this.audioPlayer.load();
    }
  }

  async analizeImage() {
    this.loaderService.show();
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
      
    } catch (error) {
      console.error('Error al analizar la imagen:', error);
      throw error; // Vuelve a lanzar el error para que sea manejado en showHowItSound
    }
  }

 togglePlay() {
  if (this.audioPlayer) {
    if (this.isPlaying) {
      this.audioPlayer.pause();
      this.removeGradientBackground(); // Desactiva el gradiente al pausar
    } else {
      this.audioPlayer.play();
      this.applyGradientBackground(); // Activa el gradiente al reproducir
    }
    this.isPlaying = !this.isPlaying;
  }
}
 seek(event: any) {
  const value = parseFloat((event.target as HTMLInputElement).value);  // Convertir a número
  if (this.audioPlayer && this.audioPlayer.duration > 0) {
    this.audioPlayer.currentTime = (this.audioPlayer.duration * value) / 100;
  }
}
  
}





