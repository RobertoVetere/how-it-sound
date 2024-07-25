import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavegadorComponent } from './components/navegador/navegador.component';
import { RouterOutlet } from '@angular/router';
import { NavegadorMobileComponent } from './components/navegador-mobile/navegador-mobile.component';
import { FooterComponent } from './components/footer/footer.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavegadorComponent, CommonModule, NavegadorMobileComponent,FooterComponent ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'howitsound';
}
