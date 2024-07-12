import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavegadorComponent } from "../navegador/navegador.component";

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [CommonModule, NavegadorComponent],
  templateUrl: './formulario.component.html',
  styleUrl: './formulario.component.css'
})
export class FormularioComponent {


}