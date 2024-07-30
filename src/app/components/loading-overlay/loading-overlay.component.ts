import { Component, Input } from '@angular/core';
import { LoaderComponent } from "../loader/loader.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-overlay',
  standalone: true,
  imports: [CommonModule, LoaderComponent],
  templateUrl: './loading-overlay.component.html',
  styleUrl: './loading-overlay.component.css'
})
export class LoadingOverlayComponent {
  @Input() loading: boolean = false;
}
