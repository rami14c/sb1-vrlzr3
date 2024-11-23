import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { AdminComponent } from './components/admin/admin.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'upload', 
    component: FileUploadComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'admin', 
    component: AdminComponent, 
    canActivate: [AuthGuard] 
  }
];