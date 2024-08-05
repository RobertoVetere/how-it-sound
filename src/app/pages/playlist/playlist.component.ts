import { Component, OnInit, OnDestroy, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DeezerService } from '../../services/deezer.service';
import { ChatService } from '../../services/chat.service';
import { LoaderService } from '../../services/loader.service';
import { SongPlaylist } from '../../models/songplaylist.data';
import { ImageStorageService } from '../../services/imagestorage.service';
import { CommonModule } from '@angular/common';
import { PlaylistService } from '../../services/playlist.service';
import { LoadingOverlayComponent } from '../../components/loading-overlay/loading-overlay.component';
import { PlaylistQuery } from '../../state/playlist/playlist.query'; // Asegúrate de importar PlaylistQuery
import { Subscription } from 'rxjs';
import { PlaylistStore } from '../../state/playlist/playlist.store';

interface Song {
  artist: string;
  title: string;
}

@Component({
  standalone: true,
  selector: 'app-playlist',
  imports: [CommonModule, LoadingOverlayComponent],
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit, OnDestroy {
  imageFile: File | null = null;
  songData: SongPlaylist[] = [];
  imageUrl: string | ArrayBuffer | null = null;
  private currentlyPlayingIndex: number | null = null;
  loading: boolean = false;
  private isNewSubscription: Subscription | undefined;

  @ViewChildren('audio') audioElements!: QueryList<ElementRef<HTMLAudioElement>>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private playlistStore: PlaylistStore,
    private deezerService: DeezerService,
    private chatService: ChatService,
    private loaderService: LoaderService,
    private imageStorageService: ImageStorageService,
    private playlistService: PlaylistService,
    private playlistQuery: PlaylistQuery // Inyecta PlaylistQuery en lugar de Observable<boolean>
  ) {
    this.loaderService.loading$.subscribe((loading) => {
      this.loading = loading;
    });
  }

  ngOnInit(): void {
    // Usa playlistQuery para obtener el observable isNew$
    this.isNewSubscription = this.playlistQuery.isNew$.subscribe(isNew => {
      if (isNew) {
        this.handleNewRequest();
      } else {
        this.handleExistingRequest();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.isNewSubscription) {
      this.isNewSubscription.unsubscribe();
    }
  }

  private async handleNewRequest(): Promise<void> {
  this.loadImage();
}

private async handleExistingRequest(): Promise<void> {
  const imageFileData = this.imageStorageService.getFile();
  const playlistData = this.playlistService.getPlaylist();

  if (imageFileData && playlistData.length > 0) {
    this.imageFile = imageFileData;
    this.songData = playlistData;
    this.createImageUrl(); // Crear la URL de la imagen
  } else {
    this.loadExistingPlaylist();
    this.imageFile = this.imageStorageService.getFile();
    if (this.imageFile) {
      this.createImageUrl();
    }
    this.loaderService.hide(); // Ocultar loader después de la carga de la lista existente
    this.playlistStore.update({ isNew: false });

  }
}


  private loadImage(): void {
    this.imageFile = this.imageStorageService.getFile();
    if (this.imageFile) {
      this.processImage();
      this.createImageUrl();
    } else {
      console.warn('No image file found in imageStorageService.');
    }
  }

  private loadExistingPlaylist(): void {
    this.songData = this.playlistService.getPlaylist();
  }

  private createImageUrl(): void {
    if (this.imageFile) {
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        this.imageUrl = event.target?.result ?? null;
      };
      reader.readAsDataURL(this.imageFile);
    } else {
      this.imageUrl = null;
    }
  }

  private async processImage(): Promise<void> {
  if (this.imageFile) {

    try {
      const result = await this.chatService.analyzeTextWithImageToPlaylist(this.imageFile);

      const songs: Song[] = result.titles.map((title: string, index: number) => ({
        title,
        artist: result.authors[index] || ''
      }));

      const songDetails = await this.deezerService.findSongsOnDeezerToPlaylist(songs).toPromise();

      if (songDetails) {
        this.songData = songDetails.map(detail => ({
          title: detail.title,
          artist: detail.artist,
          preview: detail.preview,
          cover: detail.cover
        }));
        //console.log('Mapped Song Data:', this.songData);

        this.playlistService.savePlaylist(this.songData);
        this.saveState(); // Guardar el estado de la imagen y la lista

        this.router.navigate([], { queryParams: { new: null }, queryParamsHandling: 'merge' });
      } else {
        console.warn('No se encontraron detalles de las canciones.');
      }
    } catch (error) {
      console.error('Error processing image:', error);
    } finally {
      this.loaderService.hide(); // Ocultar el loader después de procesar la imagen
      this.playlistStore.update({ isNew: false });
    }
  } else {
    this.loaderService.hide(); // Asegúrate de ocultar el loader si no hay imagen
    this.playlistStore.update({ isNew: false });
  }
}

  private saveState(): void {
    if (this.imageFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          localStorage.setItem('savedImage', reader.result);
        }
      };
      reader.readAsDataURL(this.imageFile);
    }

    if (this.songData.length > 0) {
      localStorage.setItem('savedPlaylist', JSON.stringify(this.songData));
    }
  }

  handlePlay(index: number): void {
    if (this.currentlyPlayingIndex !== null && this.currentlyPlayingIndex !== index) {
      const previousAudio = this.audioElements.toArray()[this.currentlyPlayingIndex]?.nativeElement;
      if (previousAudio) {
        previousAudio.pause();
        previousAudio.currentTime = 0;
      }
    }
    this.currentlyPlayingIndex = index;
  }

  playNext(currentIndex: number): void {
    if (this.songData.length > 0) {
      const nextIndex = (currentIndex + 1) % this.songData.length;
      const audio = this.audioElements.toArray()[nextIndex]?.nativeElement;
      if (audio) {
        audio.play();
      }
    }
  }
}
