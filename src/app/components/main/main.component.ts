import { Component, ElementRef, Renderer2    } from '@angular/core';
import { ChatService } from '../../services/chat.service'; 
import { CommonModule } from '@angular/common';
import { DeezerService } from '../../services/deezer.service';
import { RouterLink } from '@angular/router';
import { LoaderComponent } from '../../loader/loader.component';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, RouterLink, LoaderComponent],
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

  imageSrc: string = 'djs.jpg';
  selectedFile: File | null = null;
  objectResult: Object | undefined;
  songTitle: string = '';
  songDescription: string = '';
  songInfo: boolean = false;
  songLink: string = '';
  apiKey: string = '';
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
    if(!localStorage.getItem('apiKey')){
      alert('Añade tu clave Api de OpenAi');
    }

    this.loaderService.show();

    try {
      const objectResult = await this.chatService.analyzeTextWithImage(this.selectedFile);
      this.songTitle = objectResult.title;
      this.songDescription = objectResult.description;
      this.colors = objectResult.colors;
      this.searchSong(this.songTitle);
      this.songInfo = true;
      this.applyGradientBackground(); // Aplicar fondo gradiente después de cargar los colores
    } catch (error) {
      console.error('Error al analizar la imagen:', error);
    }finally {
      // Ocultar loader después de completar la operación
      this.loaderService.hide();
    }

  }

  uploadImage(){
    alert("imagen subida")
    
  }

  closeModal() {
    this.songInfo = false; 
    document.querySelector('main')?.classList.remove('bg-gradient-animation');
  }

  searchSong(songTitle: string) {
    this.deezerService.findSongOnDeezer(songTitle).subscribe(
      (link: string) => {
        this.songLink = link; // Asigna el enlace de la canción a la variable 'songLink'
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
