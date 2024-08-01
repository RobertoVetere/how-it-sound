import { Component } from '@angular/core';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css'
})
export class LoaderComponent {

  preloadImages() {
  const images = ['assets/images/loader.webp'];
  images.forEach(src => {
    const img = new Image();
    img.src = src;
  });
}

}
