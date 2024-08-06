import { Injectable } from '@angular/core';
import { SongPlaylist } from '../models/songplaylist.data';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  private storageKey = 'user-playlist';

  savePlaylist(songData: SongPlaylist[]): void {
    //console.log('Saving playlist to session storage:', songData);
    sessionStorage.setItem(this.storageKey, JSON.stringify(songData));
  }

  getPlaylist(): SongPlaylist[] {
    const data = sessionStorage.getItem(this.storageKey);
    //console.log('Loaded playlist from session storage:', data);
    return data ? JSON.parse(data) : [];
  }

  clearPlaylist(): void {
    sessionStorage.removeItem(this.storageKey);
  }
}
