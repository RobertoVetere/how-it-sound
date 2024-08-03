import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SongPlaylist } from '../models/songplaylist.data';

interface Song {
  artist: string;
  title: string;
}

@Injectable({
  providedIn: 'root'
})
export class DeezerService {
  //private backendDeezerSong = 'https://photosong-backend-production.up.railway.app/api/deezer/song';
  //private backendPlayslist = 'https://photosong-backend-production.up.railway.app/api/deezer/song';
  private backendDeezerSong = 'http://localhost:8081/api/deezer/song';
  private backendPlayslist = 'http://localhost:8081/api/deezer/playlist';

  constructor(private http: HttpClient) { }

  findSongOnDeezer(artist: string, songTitle: string): Observable<string> {
    const params = new HttpParams().set('artist', artist).set('songTitle', songTitle);
    return this.http.get(this.backendDeezerSong, { params, responseType: 'text' });
  }

  findSongsOnDeezerToPlaylist(songs: Song[]): Observable<SongPlaylist[]> {
  return this.http.post<SongPlaylist[]>(this.backendPlayslist, songs, {
  headers: {
    'Content-Type': 'application/json'
  }});
}
}