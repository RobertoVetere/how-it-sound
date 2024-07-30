import { Component, ElementRef, ViewChild, Renderer2 ,OnInit, OnDestroy} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.css']
})
export class IntroComponent implements OnInit, OnDestroy {



constructor(
    private renderer: Renderer2, private elementRef: ElementRef, ) {
      
    };

  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;
  @ViewChild('audioPlayerModal') audioPlayerModal!: ElementRef<HTMLAudioElement>;
  @ViewChild('songModal') songModal!: ElementRef<HTMLDivElement>;
  @ViewChild('slideTrack') slideTrack!: ElementRef<HTMLDivElement>;

  currentSong = { title: '', author: '', description: '', link: '' };
  currentImageSrc = '';
  showModal = false;
  currentLink = '';
  titleSong = '';
  authorSong = '';
  photoThanks = '';
  colors: string[] = [];

  images = [
    { src: 'assets/images/intro/djs.webp', audioSrc: 'assets/audio/Dont Stop the Music-Rihanna.mp3' },
    { src: 'assets/images/intro/alberto-restifo.webp', audioSrc: 'assets/audio/City of Blinding Lights-U2.mp3' },
    { src: 'assets/images/intro/drew-dizzy-graham.webp', audioSrc: 'assets/audio/Oceans-Hillsong United.mp3' },
    { src: 'assets/images/intro/michael-discenza.webp', audioSrc: 'assets/audio/Dancing Queen-ABBA.mp3' },
    { src: 'assets/images/intro/nick-fewings.webp', audioSrc: 'assets/audio/Blinding Lights-The Weeknd.mp3' },
    { src: 'assets/images/intro/tim-mossholde.webp', audioSrc: 'assets/audio/Here Comes the Sun-George Harrison.mp3' },
    { src: 'assets/images/intro/jed-villejo.webp', audioSrc: 'assets/audio/Dancing in the Moonlight-Toploader.mp3' },
    { src: 'assets/images/intro/spencer-everett.webp', audioSrc: 'assets/audio/Drive My Car-The Beatles.mp3' },
    { src: 'assets/images/intro/theodor-vasile.webp', audioSrc: 'assets/audio/Bésame Mucho-Consuelo Velázquez.mp3' },
    { src: 'assets/images/intro/alberto-restifo.webp', audioSrc: 'assets/audio/A Sky Full of Stars-Coldplay.mp3' },
    { src: 'assets/images/intro/antonio-vetere.webp', audioSrc: 'assets/audio/Streets of Philadelphia-Bruce Springsteen.mp3' },
    { src: 'assets/images/intro/michael-dam.webp', audioSrc: 'assets/audio/Smile-Nat King Cole.mp3' },
    { src: 'assets/images/intro/nathan-dumlao.webp', audioSrc: 'assets/audio/Sea of Love-Phil Phillips.mp3' },
    { src: 'assets/images/intro/nik-younie.webp', audioSrc: 'assets/audio/Nights in White Satin-The Moody Blues.mp3' },
    { src: 'assets/images/intro/dylan-sauerwein.webp', audioSrc: 'assets/audio/We Are Family-Sister Sledge.mp3' },
    // Agrega más objetos según sea necesario
  ];

   ngOnInit() {
     // Mezclar imágenes al inicio si es necesario
  }

  ngOnDestroy() {
  console.log('IntroComponent destroyed');

  // Limpiar el elemento de audio principal
  if (this.audioPlayer && this.audioPlayer.nativeElement) {
    const audioElement = this.audioPlayer.nativeElement;
    if (audioElement.pause) {
      audioElement.pause(); // Pausa la reproducción
      audioElement.src = ''; // Limpia la fuente
      audioElement.load(); // Recarga el elemento
    }
  }

  // Limpiar el elemento de audio modal si existe
  if (this.audioPlayerModal && this.audioPlayerModal.nativeElement) {
    const audioElementModal = this.audioPlayerModal.nativeElement;
    if (audioElementModal.pause) {
      audioElementModal.pause();
      audioElementModal.src = '';
      audioElementModal.load();
    }
  }

  // Limpiar el elemento de slide track
  if (this.slideTrack && this.slideTrack.nativeElement) {
    const slideTrackElement = this.slideTrack.nativeElement;
    if (slideTrackElement.classList) {
      slideTrackElement.classList.remove('animate-scroll');
    }
  }

  // Solo acceder al DOM si está definido (contexto del navegador)
  if (typeof document !== 'undefined') {
    // Revertir cambios en el DOM
    const introContainer = document.getElementById('intro-container');
    if (introContainer && introContainer.classList) {
      introContainer.classList.remove('bg-gradient-animation');
    }

    const buttonPlay = document.getElementById('btnPlayAndHideBtn');
    if (buttonPlay && buttonPlay.classList) {
      buttonPlay.classList.remove('hideBtn');
    }
  }

  // Asegurarse de que el garbage collector pueda liberar memoria
  // No hacer referencias a objetos que ya deberían ser destruidos
  this.audioPlayer = null!;
  this.audioPlayerModal = null!;
  this.slideTrack = null!;
  this.songModal = null!;
  this.currentImageSrc = '';
  this.currentSong = { title: '', author: '', description: '', link: '' };
  this.showModal = false;
}


  // Método para mezclar el array
  shuffleImages() {
    for (let i = this.images.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.images[i], this.images[j]] = [this.images[j], this.images[i]]; // Intercambia los elementos
    }
  }

  // Método para reproducir audio
  playAudio(audioSrc: string) {
    const audioElement = this.audioPlayer.nativeElement;
    if (audioElement.src !== audioSrc) {
      audioElement.src = audioSrc;
      audioElement.play();
    } else if (audioElement.paused) {
      audioElement.play();
    }
  }

  pauseAudio() {
  if (!this.showModal) {  // Solo pausa si la modal está cerrada
    const audioElement = this.audioPlayer.nativeElement;
    if (!audioElement.paused) {
      audioElement.pause();
      audioElement.currentTime = 0;
      }
    }
  }

  // Método para abrir la modal y reproducir el audio correspondiente
  openModal(image: { src: string; audioSrc: string }) {
    this.currentImageSrc = image.src;
    this.currentSong.link = image.audioSrc;
    const cleanPhotoUrl = image.src.startsWith("assets/images/intro/") ? image.src.substring("assets/images/intro/".length) : image.src;
    const cleanAudioSrc = image.audioSrc.startsWith("assets/audio/") ? image.audioSrc.substring("assets/audio/".length) : image.audioSrc;

    this.photoThanks = cleanPhotoUrl.split('-')
                               .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                               .join(' ').split(".")[0];

    this.titleSong = cleanAudioSrc.split("-")[0];
    this.authorSong = cleanAudioSrc.split("-")[1].split(".")[0];
    this.showModal = true;
    this.stopAnimation();
    this.applyGradientBackground();
  }

  // Método para cerrar la modal
  closeModal() {
    this.shuffleImages();
    this.showModal = false;
    this.pauseAudio();
    this.removeGradientBackground();
    this.startAnimation();
  }

  // Método para iniciar la animación del slider
  startAnimation() {
    const slideTrackElement = this.slideTrack?.nativeElement;
    if (slideTrackElement) {
      slideTrackElement.classList.add('animate-scroll');
    }
  }

  // Método para detener la animación del slider
  stopAnimation() {
    const slideTrackElement = this.slideTrack?.nativeElement;
    if (slideTrackElement) {
      slideTrackElement.classList.remove('animate-scroll');
    }
  }

  private applyGradientBackground() {
    document.getElementById('intro-container')?.classList.add('bg-gradient-animation');
    
  }

  private removeGradientBackground() {
    document.getElementById('intro-container')?.classList.remove('bg-gradient-animation');
  }

  hideButton() {
    document.getElementById('btnPlayAndHideBtn')?.classList.add('hideBtn')
    } 
}