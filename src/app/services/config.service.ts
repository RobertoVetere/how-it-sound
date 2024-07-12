import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private apiKeyKey = 'apiKey';

  constructor() { }

  getApiKey(): string | null {
    return localStorage.getItem(this.apiKeyKey);
  }

  setApiKey(apiKey: string): void {
    localStorage.setItem(this.apiKeyKey, apiKey);
  }
}