declare var google: any;

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class GoogleAuthService {

  constructor(private router: Router) {}
  
  private scriptLoaded = false;

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
    return JSON.parse(atob(token.split(".")[1]))
  }

  handleLogin(response: any){
    if(response){
      const payLoad = this.decodeToken(response.credential);
      sessionStorage.setItem("loggedInUser", JSON.stringify(payLoad));
      this.router.navigate(['/home'])
      
    }
  }

  signout(){
    google.accounts.id.disableAutoSelect();
    this.router.navigate(['/login'])
  }
}