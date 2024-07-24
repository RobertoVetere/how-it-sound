import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.css']
})
export class IntroComponent {
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  images = [
    { src: 'assets/images/intro/djs.jpg', audioSrc: 'assets/audio/rihanna-dont-stop-the-music.mp3' },
    { src: 'assets/images/intro/alberto-restifo.jpg', audioSrc: 'assets/audio/city-of-blinding-lights-u2.mp3' },
    { src: 'assets/images/intro/drew-dizzy-graham.jpg', audioSrc: 'assets/audio/Oceans-Hillsong-UNITED.mp3' },
    { src: 'assets/images/intro/michael-discenza.jpg', audioSrc: 'assets/audio/Dancing-Queen-ABBA.mp3' },
    { src: 'assets/images/intro/nick-fewings.jpg', audioSrc: 'assets/audio/Blinding-Lights-The-Weeknd.mp3' },
    { src: 'assets/images/intro/tim-mossholde.jpg', audioSrc: 'assets/audio/Here-Comes-the-Sun-George Harrison.mp3' },
    { src: 'assets/images/intro/jed-villejo.jpg', audioSrc: 'assets/audio/Dancing-in-the-Moonlight-Toploader.mp3' },
    { src: 'assets/images/intro/spencer-everett.jpg', audioSrc: 'assets/audio/Drive-My-Car-The-Beatles.mp3' },
    { src: 'assets/images/intro/theodor-vasile.jpg', audioSrc: 'assets/audio/Bésame-Mucho-Consuelo-Velázquez.mp3' },
    { src: 'assets/images/intro/alberto-restifo.jpg', audioSrc: 'assets/audio/A-Sky-Full-of-Stars-Coldplay.mp3' },
    { src: 'assets/images/intro/antonio-vetere.jpg', audioSrc: 'assets/audio/Streets-of-Philadelphia-Bruce-Springsteen.mp3' },
    { src: 'assets/images/intro/michael-dam.jpg', audioSrc: 'assets/audio/Smile-Nat-King-Cole.mp3' },
    { src: 'assets/images/intro/nathan-dumlao.jpg', audioSrc: 'assets/audio/Sea-of-Love-Phil-Phillips.mp3' },
    { src: 'assets/images/intro/nik-younie.jpg', audioSrc: 'assets/audio/Nights-in-White-Satin-The-Moody-Blues.mp3' },
    { src: 'assets/images/intro/dylan-sauerwein.jpg', audioSrc: 'assets/audio/We-Are-Family-Sister-Sledge.mp3' },
    // Agrega más objetos según sea necesario
  ];

  // Método para reproducir el audio
  playAudio(audioSrc: string) {
    if (this.audioPlayer && this.audioPlayer.nativeElement) {
      const audioElement = this.audioPlayer.nativeElement;
      audioElement.src = audioSrc; // Actualiza la fuente del audio
      audioElement.play(); // Reproduce el audio
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