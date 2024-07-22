import { Injectable } from '@angular/core';
import axios, { AxiosResponse } from 'axios'; // Import Axios
import { Observable, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators'; // Import map and catchError operators

@Injectable({
  providedIn: 'root'
})
export class DeezerService {
  private deezerApiUrl = 'https://api.deezer.com/search';

  constructor() { }

  findSongOnDeezer(artist: string, songTitle: string): Observable<string> {
    // Construct API URL with the artist and song title
    const apiUrl = `${this.deezerApiUrl}?q=artist:"${encodeURIComponent(artist)}" track:"${encodeURIComponent(songTitle)}"`;

    return from(axios.get(apiUrl)).pipe(
      map((response: AxiosResponse) => {
        // Check if the response contains data
        if (response.data && response.data.data && response.data.data.length > 0) {
          // Extract and return the preview URL of the first song
          return response.data.data[0].preview;
        } else {
          throw new Error('No song found with the given artist and title.');
        }
      }),
      catchError(error => {
        // Handle errors
        console.error('Error fetching song:', error);
        throw new Error('Error fetching song. Please try again later.');
      })
    );
  }
}