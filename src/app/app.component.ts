import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavegadorComponent } from './components/navegador/navegador.component';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavegadorComponent, CommonModule ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'howitsound';
}
