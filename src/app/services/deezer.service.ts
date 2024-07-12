import { Injectable } from '@angular/core';
import axios, { AxiosResponse } from 'axios'; // Import Axios
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators'; // Import map operator

@Injectable({
  providedIn: 'root'
})
export class DeezerService {
  private deezerApiUrl = 'https://api.deezer.com/search';

  constructor() { }

  findSongOnDeezer(songTitle: string): Observable<string> {
    const apiUrl = `${this.deezerApiUrl}?q=${encodeURIComponent(songTitle)}`;

    return from(axios.get(apiUrl))
      .pipe(
        map((response: AxiosResponse) => {
          if (response && response.data && response.data.data && response.data.data.length > 0) {
            return response.data.data[0].preview; // Extract the link of the first song
          } else {
            throw new Error('No song found with that title.');
          }
        })
      );
  }
}
