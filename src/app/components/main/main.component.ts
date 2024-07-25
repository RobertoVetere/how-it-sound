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

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, RouterLink, LoaderComponent, MusicFilterComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {

  audioPlayer: HTMLAudioElement | null = null;
  constructor(private chatService: ChatService, private loaderService: LoaderService, private deezerService: DeezerService,
    private renderer: Renderer2,
    private elementRef: ElementRef) {
      this.loaderService.loading$.subscribe((loading) => {
      this.loading = loading;
    });
  }
  
  imageData: ImageData = { src: 'djs.jpg', file: null };
  songData: SongData = { title: '', author: '', description: '', link: '', colors: [] };
  objectResult: Object | undefined;
  songInfo: boolean = false;
  apiKey: string = '';
  colors: string[] = [];
  loading: boolean = false;
  apiCallsLeft: number = 3;

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.imageData.file = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageData.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  triggerFileInput(fileInput: HTMLInputElement) {
    fileInput.click();
  }

  async showHowItSound() {
    if (!this.imageData.file) {
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
          this.audioPlayer.load(); // Cargar la nueva fuente de audio
          this.audioPlayer.loop = true;
          this.audioPlayer.volume = 0.5;
          this.audioPlayer.play(); // Comenzar la reproducción
          this.audioPlayer.addEventListener('pause', () => {
            document.querySelector('main')?.classList.remove('bg-gradient-animation');
          });
          this.audioPlayer.addEventListener('play', () => {
            document.querySelector('main')?.classList.add('bg-gradient-animation');
          });
          
        }
        this.loaderService.hide();
        this.songInfo = true;
      },
      error: (error) => {
      this.songInfo = false;
        console.error('Error al buscar canción en Deezer:', error.message);
        this.clearAudioPlayer();
        if(this.apiCallsLeft > 0){
          this.analizeImage();
          this.apiCallsLeft -= 1;
          console.log("quedan: " + this.apiCallsLeft + "intentos")
        }else{
          alert("¡Ups! Algo ha salido mal, prueba de nuevo");
        }
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
      
      //this.applyGradientBackground();
    } catch (error) {
      console.error('Error al analizar la imagen:', error);
      throw error; // Vuelve a lanzar el error para que sea manejado en showHowItSound
    }
  }

  saveToGallery() {
    throw new Error('Method not implemented.');
  }
}
