import { Component, ElementRef, Renderer2    } from '@angular/core';
import { ChatService } from '../../services/chat.service'; 
import { CommonModule } from '@angular/common';
import { DeezerService } from '../../services/deezer.service';
import { RouterLink } from '@angular/router';
import { LoaderComponent } from '../loader/loader.component';
import { LoaderService } from '../../services/loader.service';
import { MusicFilterComponent } from '../music-filter/music-filter.component';
import { NgZone } from '@angular/core';
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

saveToGallery() {
throw new Error('Method not implemented.');
}
audioPlayer: HTMLAudioElement | null = null;
  constructor(private chatService: ChatService, private loaderService: LoaderService, private deezerService: DeezerService,
    private renderer: Renderer2,
    private elementRef: ElementRef, private ngZone: NgZone ) {
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
    if(!localStorage.getItem('apiKey')){
      alert('Añade tu clave Api de OpenAi');
    }

    this.loaderService.show();

   this.ngZone.run(() => {
    setTimeout(async () => {
      try {
        if (this.imageData.file) {
            const result = await this.chatService.analyzeTextWithImage(this.imageData.file);
            this.songData = {
              title: result.title,
              author: result.authorSong,
              description: result.description,
              link: '',
              colors: result.colors
            };
            this.searchSong(this.songData.author, this.songData.title);
            this.songInfo = true;
            this.applyGradientBackground();
          }
      } catch (error) {
        console.error('Error al analizar la imagen:', error);
      } finally {
        // Ocultar loader después de completar la operación
        this.loaderService.hide();
      }
    }, 0); // Retraso de 0 ms para asegurar la actualización del DOM
  });

  }

  uploadImage(){
    alert("imagen subida")
    
  }

  closeModal() {
    this.songInfo = false; 
    document.querySelector('main')?.classList.remove('bg-gradient-animation');
  }

  searchSong(songAuthor: string ,songTitle: string) {
    this.deezerService.findSongOnDeezer(songAuthor,songTitle).subscribe(
      (link: string) => {
        console.log(link)
        this.songData.link = link; // Asigna el enlace de la canción a la variable 'songLink'
        this.audioPlayer = document.getElementById('audioPlayer') as HTMLAudioElement;
       
        if ( this.audioPlayer) {
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
      },
      (error) => {
        console.error('Error al buscar canción en Deezer:', error.message);
        this.loaderService.hide();
      }
    );
  }
private applyGradientBackground() {
    const gradient = `linear-gradient(-45deg, ${this.colors.join(', ')})`;
    document.querySelector('main')?.style, 'background', gradient;
    document.querySelector('main')?.classList.add('bg-gradient-animation');
    
  }

  private removeGradientBackground() {
    this.renderer.setStyle(this.elementRef.nativeElement.querySelector('main'), 'background', '');
    document.querySelector('body')?.classList.remove('bg-gradient-animation');
  }
}
