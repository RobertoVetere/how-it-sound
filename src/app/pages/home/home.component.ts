import { Component } from '@angular/core';
import { NavegadorComponent } from "../../components/navegador/navegador.component";
import { MainComponent } from "../../components/main/main.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavegadorComponent, MainComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
