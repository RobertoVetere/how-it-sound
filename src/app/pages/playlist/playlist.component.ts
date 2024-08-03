import { Component, OnInit, ViewChild, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DeezerService } from '../../services/deezer.service';
import { ChatService } from '../../services/chat.service'; 
import { LoaderService } from '../../services/loader.service';
import { SongPlaylist } from '../../models/songplaylist.data';
import { ImageStorageService } from '../../services/imagestorage.service';
import { CommonModule } from '@angular/common';
import { PlaylistService } from '../../services/playlist.service';

interface Song {
  artist: string;
  title: string;
}

@Component({
  standalone: true,
  selector: 'app-playlist',
  imports: [CommonModule],
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit {
  imageFile: File | null = null;
  songData: SongPlaylist[] = [];
  imageUrl: string | ArrayBuffer | null = null;
  private currentlyPlayingIndex: number | null = null;

  @ViewChildren('audio') audioElements!: QueryList<ElementRef<HTMLAudioElement>>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private deezerService: DeezerService,
    private chatService: ChatService,
    private loaderService: LoaderService,
    private imageStorageService: ImageStorageService,
    private playlistService: PlaylistService,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const isNew = params['new'] === 'true';

      if (isNew) {
        this.loadImage();
      } else {
        this.loadExistingPlaylist();
        this.imageFile = this.imageStorageService.getFile();
        if (this.imageFile) {
          this.createImageUrl();
        }
      }
    });
  }

  private loadImage(): void {
    this.imageFile = this.imageStorageService.getFile();
    if (this.imageFile) {
      this.loaderService.show();
      this.processImage();
      this.createImageUrl();
    } else {
      this.loaderService.hide();
      console.warn('No image file found in imageStorageService.');
    }
  }

  private loadExistingPlaylist(): void {
    this.songData = this.playlistService.getPlaylist();
    this.loaderService.hide();
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

  private async processImage() {
    if (this.imageFile) {
      console.log('Processing image:', this.imageFile);

      try {
        const result = await this.chatService.analyzeTextWithImageToPlaylist(this.imageFile);
        console.log('Chat Service result:', result);

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
          console.log('Mapped Song Data:', this.songData);

          this.playlistService.savePlaylist(this.songData);

          // Remover el parámetro 'new' de la URL
          this.router.navigate([], { queryParams: { new: null }, queryParamsHandling: 'merge' });
        } else {
          console.warn('No se encontraron detalles de las canciones.');
        }
      } catch (error) {
        console.error('Error processing image:', error);
      } finally {
        this.loaderService.hide();
      }
    } else {
      this.loaderService.hide();
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
