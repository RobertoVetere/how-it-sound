// src/app/app.config.ts

import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { provideHttpClient } from '@angular/common/http';




const appConfig = {
  providers: [
     provideHttpClient(),
    provideRouter(routes)
  ]
};

bootstrapApplication(AppComponent, appConfig)
  .catch(err => console.error(err));
