import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  mockLogin(provider: string): void {
    // Simulate authentication
    this.isAuthenticatedSubject.next(true);
    localStorage.setItem('isAuthenticated', 'true');
  }

  logout(): void {
    this.isAuthenticatedSubject.next(false);
    localStorage.removeItem('isAuthenticated');
  }

  checkAuthStatus(): boolean {
    const isAuth = localStorage.getItem('isAuthenticated') === 'true';
    this.isAuthenticatedSubject.next(isAuth);
    return isAuth;
  }
}