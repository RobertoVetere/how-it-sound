import { importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(HttpClientModule), // Si estás usando HttpClient
    provideRouter(routes, withPreloading(PreloadAllModules)),
  ]
})
.catch((err) => console.error(err));
