import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

declare var google: any; // Declaración de la variable global de Google

@Injectable({
  providedIn: 'root',
})
export class GoogleAuthService implements OnInit {

  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  private scriptLoaded = false;
  private google: any;
 

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadScript().then(() => {
      // La carga del script fue exitosa
      if (typeof google === 'undefined') {
        console.warn('Google API is not defined.'); // Puedes agregar un mensaje de advertencia si google no está definido
      } else {
        this.google = google;
      }
    }).catch((error) => {
      console.error('Error loading Google API:', error);
    });
  }

  

  private hasToken(): boolean {
    if (this.isBrowser()) {
      return !!sessionStorage.getItem('loggedInUser'); 
    }
    return false;
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof sessionStorage !== 'undefined';
  }

  loadScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.scriptLoaded) {
        resolve();
        return;
      }

      if (typeof document === 'undefined') {
        reject(new Error('Document is not defined'));
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        this.scriptLoaded = true;
        resolve();
      };
      script.onerror = (error) => reject(error);
      document.head.appendChild(script);
    });
  }

  private decodeToken(token: string){
    return JSON.parse(atob(token.split(".")[1]));
  }

  handleLogin(response: any){
    if(response){
      const payLoad = this.decodeToken(response.credential);
      sessionStorage.setItem("loggedInUser", JSON.stringify(payLoad));
      this.isLoggedInSubject.next(true); 
      this.router.navigate(['/home']);
    }
  }

  signout(){
    sessionStorage.removeItem('loggedInUser');
    if (this.google && this.google.accounts && this.google.accounts.id) {
      this.google.accounts.id.disableAutoSelect();
    } else {
      console.warn('Google API or necessary components are not available.');
    }
    this.isLoggedInSubject.next(false); 
    this.router.navigate(['/']);
  }
}