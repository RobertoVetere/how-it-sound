import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatService } from '../../services/chat.service';


@Component({
  selector: 'app-music-filter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './music-filter.component.html',
  styleUrl: './music-filter.component.css'
})
export class MusicFilterComponent {
isFilterVisible: boolean = false;
musicStyles = ['Pop', 'Rock', 'Jazz', 'Electronic', 'Hip-hop', 'Classical', 'Trap', 'Reggaeton', 'EDM', 'Dance', 'Sorpréndeme'];
selectedStyle: string = 'Pop'; 

constructor(private chatService: ChatService) { }

toggleFilter() {
  this.isFilterVisible = !this.isFilterVisible;
}
handleSelection(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedStyle = value;
    if (value !== 'Sorprendeme') {
      this.isFilterVisible = false;
      this.onSelect(this.selectedStyle);
    }
  }
  onSelect(style: string) {
    this.selectedStyle = style;
    this.chatService.updateSelectedOption(style); // Llama al método del servicio para actualizar la opción seleccionada
  }
}

  
