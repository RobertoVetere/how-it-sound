import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  @ViewChild('apiKeyInput') apiKeyInput!: ElementRef;
  apiKey: string = '';
  apiKeyRegex: RegExp = /^sk-proj-[a-zA-Z0-9]+$/;

  constructor() {}

  ngOnInit(): void {
    const storedApiKey = localStorage.getItem('apiKey');
    if (storedApiKey) {
      this.apiKey = storedApiKey;
    }
  }

  saveApiKey(): void {
    const apiKeyValue = this.apiKeyInput.nativeElement.value.trim();
    if (this.validateApiKey(apiKeyValue)) {
      localStorage.setItem('apiKey', apiKeyValue);
      console.log('API Key guardada:', localStorage.getItem('apiKey'));
      this.apiKey = apiKeyValue;
      this.apiKeyInput.nativeElement.value = '';
    } else {
      alert('Formato de API Key no válido. Debe seguir el formato sk-proj-XXXX.');
    }
  }

  deleteApiKey(): void {
    localStorage.removeItem('apiKey');
    this.apiKey = '';
    this.apiKeyInput.nativeElement.value = '';
    alert('La clave API se ha borrado correctamente');
  }

  validateApiKey(apiKey: string): boolean {
    return this.apiKeyRegex.test(apiKey);
  }
}