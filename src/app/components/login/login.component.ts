import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <div class="card" style="max-width: 400px; margin: 48px auto;">
        <h1 class="page-title" style="text-align: center;">Welcome Back</h1>
        <p style="text-align: center; color: var(--text-secondary); margin-bottom: 24px;">
          Sign in to continue to ICD Validator
        </p>
        <div class="login-buttons">
          <button class="btn btn-primary" (click)="login('google')" style="width: 100%;">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.545,12.151L12.545,12.151c0,1.054,0.855,1.909,1.909,1.909h3.536c-0.607,1.972-2.101,3.467-4.26,3.467c-2.624,0-4.747-2.124-4.747-4.747s2.124-4.747,4.747-4.747c1.123,0,2.178,0.391,3.004,1.096l1.817-1.817C16.944,6.41,14.901,5.698,12.545,5.698c-4.497,0-8.132,3.636-8.132,8.132s3.636,8.132,8.132,8.132c4.497,0,8.132-3.636,8.132-8.132v-1.509h-8.132V12.151z"/>
            </svg>
            Continue with Google
          </button>
          <button class="btn btn-secondary" (click)="login('microsoft')" style="width: 100%;">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z"/>
            </svg>
            Continue with Microsoft
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-buttons {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
  `]
})
export class LoginComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login(provider: string) {
    this.authService.mockLogin(provider);
    this.router.navigate(['/upload']);
  }
}