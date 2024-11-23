import { bootstrapApplication } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from './app/components/nav-bar/nav-bar.component';
import { appConfig } from './app/app.config';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavBarComponent],
  template: `
    <app-nav-bar></app-nav-bar>
    <main>
      <router-outlet></router-outlet>
    </main>
  `
})
export class App {}

bootstrapApplication(App, appConfig)
  .catch(err => console.error(err));