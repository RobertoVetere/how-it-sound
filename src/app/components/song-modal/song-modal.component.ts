import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SongData } from '../../models/song.data';

@Component({
  selector: 'app-song-modal',
  templateUrl: './song-modal.component.html',
  standalone: true,
  styleUrls: ['./song-modal.component.css']
})
export class SongModalComponent {
  @Input() isVisible: boolean = false;
  @Input() song: { title: string, author: string, description: string, link: string } | null = null;
  @Input() imageSrc: string | null = null;

  @Output() close = new EventEmitter<void>();
  @Output() tryAnother = new EventEmitter<void>();
  @Output() saveToGallery = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
  }

  tryAnotherSong() {
    this.tryAnother.emit();
  }

  saveSong() {
    this.saveToGallery.emit();
  }
}