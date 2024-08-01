import { Blob } from "buffer";

  export interface SongData {
    image: Blob;
    titleSong: string;
    authorSong: string;
    songLink: string;
  }