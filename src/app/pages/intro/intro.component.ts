import { Component,  ElementRef, ViewChild  } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-slider',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.css']
})
export class IntroComponent {
  
  
@ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;


  images = [
    { src: 'assets/images/intro/djs.jpg' ,
      audioSrc: 'assets/audio/ejemplo.mp3'  
    },
    { src: 'assets/images/intro/alberto-restifo.jpg',audioSrc: 'assets/audio/ejemplo.mp3'  },
    { src: 'assets/images/intro/jakob-owens.jpg',audioSrc: 'assets/audio/ejemplo.mp3'  },
    { src: 'assets/images/intro/michael-discenza.jpg',audioSrc: 'assets/audio/ejemplo.mp3'  },
    { src: 'assets/images/intro/nick-fewings.jpg',audioSrc: 'assets/audio/ejemplo.mp3'  },
    { src: 'assets/images/intro/tim-mossholde.jpg',audioSrc: 'assets/audio/ejemplo.mp3'  },
    { src: 'assets/images/intro/jed-villejo.jpg',audioSrc: 'assets/audio/ejemplo.mp3'  },
    { src: 'assets/images/intro/spencer-everett.jpg',audioSrc: 'assets/audio/ejemplo.mp3'  },
    { src: 'assets/images/intro/theodor-vasile.jpg',audioSrc: 'assets/audio/ejemplo.mp3'  },
    { src: 'assets/images/intro/alberto-restifo.jpg',audioSrc: 'assets/audio/ejemplo.mp3'  },
    { src: 'assets/images/intro/antonio-vetere.jpg',audioSrc: 'assets/audio/ejemplo.mp3'  },
    { src: 'assets/images/intro/michael-dam.jpg',audioSrc: 'assets/audio/ejemplo.mp3'  },
    { src: 'assets/images/intro/nathan-dumlao.jpg',audioSrc: 'assets/audio/ejemplo.mp3'  },
    { src: 'assets/images/intro/nik-younie.jpg',audioSrc: 'assets/audio/ejemplo.mp3'  },
    { src: 'assets/images/intro/dylan-sauerwein.jpg',audioSrc: 'assets/audio/ejemplo.mp3'  },
    // Agrega más objetos según sea necesario
  ];

 
  // Método para reproducir el audio
  playAudio() {
    if (this.audioPlayer && this.audioPlayer.nativeElement) {
      this.audioPlayer.nativeElement.play();
    }
  }

  // Método para pausar y reiniciar la reproducción del audio
  pauseAudio() {
    if (this.audioPlayer && this.audioPlayer.nativeElement) {
      const audioElement = this.audioPlayer.nativeElement;
      audioElement.pause();
      audioElement.currentTime = 0; // Reinicia la reproducción al inicio
    }
  }
}