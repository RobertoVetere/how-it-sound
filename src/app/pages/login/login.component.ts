import { Component, OnInit } from '@angular/core';
import { GoogleAuthService } from '../../services/authgoogle.service';
import { Router } from '@angular/router';

declare var google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  
  constructor(private googleAuthService: GoogleAuthService, private router: Router) {}

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
          client_id: '21471103229-0m0fh9fa3ni7r31oo2ura8dckf7oqt2e.apps.googleusercontent.com',
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
}