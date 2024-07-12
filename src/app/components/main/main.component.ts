import { Component, NgModule   } from '@angular/core';
import { ChatService } from '../../services/chat.service'; 
import { CommonModule } from '@angular/common';
import { TypingService } from '../../services/typing.service';
import { DeezerService } from '../../services/deezer.service';


@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
saveToGallery() {
throw new Error('Method not implemented.');
}

  constructor(private chatService: ChatService, private typingService: TypingService, private deezerService: DeezerService) {}

  imageSrc: string = 'djs.jpg';
  selectedFile: File | null = null;
  objectResult: Object | undefined;
  songTitle: string = '';
  songDescription: string = '';
  songInfo: boolean = false;
  songLink: string = '';
  //audioSrc: string = '';

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

    const objectResult = await this.chatService.analyzeTextWithImage(this.selectedFile);
    if(objectResult){
      this.songTitle = objectResult.title;
      this.songDescription = objectResult.description;
      this.searchSong(this.songTitle);
      this.songInfo = true;
    }
  }

  uploadImage(){
    alert("imagen subida")
    
  }

  closeModal() {
    this.songInfo = false; 
  }

  searchSong(songTitle: string) {
    this.deezerService.findSongOnDeezer(songTitle).subscribe(
      (link: string) => {
        this.songLink = link; // Asigna el enlace de la canción a la variable 'songLink'
        
        // Reproducir automáticamente la canción al obtener el enlace
        const audioPlayer = document.getElementById('audioPlayer') as HTMLAudioElement;
        if (audioPlayer) {
          audioPlayer.load(); // Cargar la nueva fuente de audio
          audioPlayer.loop = true;
          audioPlayer.play(); // Comenzar la reproducción
        }
      },
      (error) => {
        console.error('Error al buscar canción en Deezer:', error.message);
      }
    );
  }}
