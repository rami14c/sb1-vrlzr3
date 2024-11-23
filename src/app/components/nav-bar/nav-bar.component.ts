import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="nav-bar">
      <div class="nav-content">
        <div class="nav-brand">ICD Validator</div>
        <div class="nav-links" *ngIf="authService.isAuthenticated$ | async">
          <a routerLink="/upload" class="nav-link">File Upload</a>
          <a routerLink="/admin" class="nav-link">Admin</a>
          <a href="#" class="nav-link" (click)="logout($event)">Logout</a>
        </div>
      </div>
    </nav>
  `
})
export class NavBarComponent {
  constructor(public authService: AuthService) {}

  logout(event: Event) {
    event.preventDefault();
    this.authService.logout();
  }
}