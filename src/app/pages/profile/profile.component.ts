import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule], // Asegúrate de importar CommonModule aquí
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  @ViewChild('apiKeyInput') apiKeyInput!: ElementRef;
  apiKey: string = '';
  apiKeyRegex: RegExp = /^sk-proj-[a-zA-Z0-9]+$/;
  isApiKeySaved: boolean = false;

  constructor() {}

  ngOnInit(): void {
    this.checkApiKeyStatus(); // Llama a una función para verificar el estado de la API Key al inicializar el componente
  }

  saveApiKey(): void {
    const apiKeyValue = this.apiKeyInput.nativeElement.value.trim();
    if (this.validateApiKey(apiKeyValue)) {
      localStorage.setItem('apiKey', apiKeyValue);
      this.apiKey = apiKeyValue;
      this.checkApiKeyStatus(); // Actualiza el estado de isApiKeySaved después de guardar la API Key
      this.apiKeyInput.nativeElement.value = '';
    } else {
      alert('Invalid API Key format. It must follow the format sk-proj-XXXX.');
    }
  }

  deleteApiKey(): void {
    localStorage.removeItem('apiKey');
    this.apiKey = '';
    this.checkApiKeyStatus(); // Actualiza el estado de isApiKeySaved después de eliminar la API Key
    this.apiKeyInput.nativeElement.value = '';
    alert('The API key has been deleted successfully');
  }

  validateApiKey(apiKey: string): boolean {
    return this.apiKeyRegex.test(apiKey);
  }

  private checkApiKeyStatus(): void {
    const storedApiKey = localStorage.getItem('apiKey');
    this.isApiKeySaved = !!storedApiKey; // Actualiza isApiKeySaved basado en si existe o no la API Key en localStorage
  }
}