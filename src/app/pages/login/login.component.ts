import { Component, OnDestroy, OnInit } from '@angular/core';
import { GoogleAuthService } from '../../services/authgoogle.service';
import { Router } from '@angular/router';

declare var google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  
  constructor(private googleAuthService: GoogleAuthService, private router: Router) {}

  private scriptLoaded = false;

  signInWithGmail() {
    // Aquí podrías implementar la lógica para manejar el inicio de sesión con Gmail
    // Por ejemplo, redirigir al usuario a la página de autenticación de Google
  }

  signInWithEmail() {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    if (typeof document !== 'undefined') {
      this.googleAuthService.loadScript().then(() => {
        google.accounts.id.initialize({
          client_id: '21471103229-hcciei33mbnrn740ovslo3ksgvr69m94.apps.googleusercontent.com',
          callback: (resp: any) => this.googleAuthService.handleLogin(resp) 
        });
        google.accounts.id.renderButton(document.getElementById('gmail-btn'), {
          theme: 'filled-blue',
          size: 'large',
          shape: 'rectangle',
          width: 300
        });
      }).catch((error: any) => {
        console.error('Error loading Google script:', error);
      });
    } else {
      console.error('Document is not defined. This code should run in the browser.');
    }
  }

  ngOnDestroy() {
    // Limpieza de recursos si es necesario
    if (this.scriptLoaded) {
      // Elimina el botón de Google y cualquier otro recurso añadido
      const gmailButton = document.getElementById('gmail-btn');
      if (gmailButton) {
        gmailButton.innerHTML = ''; // Limpia el contenido del botón
      }

      // Aquí podrías también eliminar el script si se ha añadido dinámicamente
      // (Esto no es necesario si el script se carga de forma estática)
    }
  }
}