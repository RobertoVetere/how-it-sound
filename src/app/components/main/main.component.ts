@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, RouterLink, LoaderComponent, MusicFilterComponent, DefaultImgDirective, FormsModule, LoadingOverlayComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnDestroy, OnInit {
  audioPlayer: HTMLAudioElement | null = null;
  songData: SongData = { title: '', author: '', description: '', link: '', colors: [] };
  imageData: ImageData = { src: 'djs.webp', file: null };
  colors: string[] = [];
  loading: boolean = false;
  apiCallsLeft: number = 3;
  isPlaying: boolean = false;
  private songQueue: { title: string; author: string }[] = [];

  constructor(
    private chatService: ChatService,
    private loaderService: LoaderService,
    private deezerService: DeezerService,
    private router: Router,
    private playlistStore: PlaylistStore,
    private imageStorageService: ImageStorageService,
    private imageProcessingService: ImageProcessingService,
    private cdr: ChangeDetectorRef
  ) {
    this.loaderService.loading$.subscribe((loading) => {
      this.loading = loading;
    });
  }

  async ngOnInit(): Promise<void> {
    this.loaderService.show();
    try {
      const file = await this.imageStorageService.getFile();
      if (file && file instanceof File) {
        this.imageData.file = file;
        this.imageData.src = await this.imageProcessingService.compressImage(file);
      } else {
        console.error('El archivo obtenido no es válido o no es una instancia de File');
      }
    } catch (error) {
      console.error('Error al obtener el archivo:', error);
    } finally {
      this.loaderService.hide();
    }
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
      const result = await this.chatService.analyzeTextWithImage(this.imageData.file);
      this.songQueue = result.titles.map((title, index) => ({
        title,
        author: result.authors[index]
      }));
      this.searchNextSong();
    } catch (error) {
      console.error('Error al analizar la imagen:', error);
    }
  }

  private async searchNextSong() {
    if (this.songQueue.length === 0) {
      alert('No se encontraron canciones.');
      return;
    }

    const { title, author } = this.songQueue.shift()!;

    this.deezerService.findSongOnDeezer(author, title).subscribe({
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

        this.applyGradientBackground();
        this.songInfo = true;
        this.loaderService.hide();
      },
      error: async (error) => {
        console.error('Error al buscar canción en Deezer:', error.message);
        if (this.apiCallsLeft > 0) {
          this.apiCallsLeft -= 1;
          await this.searchNextSong(); // Intenta buscar la siguiente canción
        } else {
          alert('No se pudo encontrar ninguna canción.');
          this.loaderService.hide();
        }
      }
    });
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

  togglePlay() {
    if (this.audioPlayer) {
      if (this.isPlaying) {
        this.audioPlayer.pause();
        this.removeGradientBackground();
      } else {
        this.audioPlayer.play();
        this.applyGradientBackground();
      }
      this.isPlaying = !this.isPlaying;
    }
  }

  seek(event: any) {
    const value = parseFloat((event.target as HTMLInputElement).value);
    if (this.audioPlayer && this.audioPlayer.duration > 0) {
      this.audioPlayer.currentTime = (this.audioPlayer.duration * value) / 100;
    }
  }
}
