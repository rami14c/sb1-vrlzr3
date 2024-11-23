import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ICDService, ICDCode } from '../../services/icd.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  template: `
    <div class="container">
      <h1 class="page-title">ICD Code Management</h1>
      <div class="admin-grid">
        <div class="card">
          <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 20px;">Add New ICD Code</h2>
          <div class="add-code-form">
            <div class="form-group">
              <label for="code">ICD Code</label>
              <input
                type="text"
                id="code"
                [(ngModel)]="newCode.code"
                class="form-control"
                placeholder="Enter ICD code"
              />
            </div> 
            
            <div class="form-group">
              <label for="description">Description</label>
              <input
                type="text"
                id="description"
                [(ngModel)]="newCode.description"
                class="form-control"
                placeholder="Enter description"
              />
            </div>
            
            <button class="btn btn-primary" (click)="addCode()" style="width: 100%;">
              Add ICD Code
            </button>
          </div>
        </div>

        <div class="card">
          <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 20px;">Existing Codes</h2>
          <div class="codes-list">
            <div *ngFor="let code of icdCodes" class="code-item">
              <div class="code-badge">{{ code.code }}</div>
              <div class="code-description">{{ code.description }}</div>
              <button class="btn-delete" (click)="deleteCode(code.code)">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }
    .add-code-form {
      max-width: 100%;
    }
    .codes-list {
      max-height: 500px;
      overflow-y: auto;
    }
    .code-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      border-bottom: 1px solid var(--border-color);
    }
    .code-badge {
      background-color: var(--primary-color);
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.875rem;
      font-weight: 500;
    }
    .code-description {
      color: var(--text-secondary);
      font-size: 0.875rem;
      flex: 1;
    }
    .btn-delete {
      background: none;
      border: none;
      color: #ef4444;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      transition: all 0.2s;
    }
    .btn-delete:hover {
      background-color: #fee2e2;
    }
    @media (max-width: 768px) {
      .admin-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AdminComponent {
  icdCodes: ICDCode[] = [];
  newCode: ICDCode = { code: '', description: '' };

  constructor(private icdService: ICDService) {
    this.icdService.getICDCodes().subscribe(codes => {
      this.icdCodes = codes;
    });
  }

  addCode() {
    if (this.newCode.code && this.newCode.description) {
      this.icdService.addICDCode({ ...this.newCode }).subscribe({
        next: () => {
          this.newCode = { code: '', description: '' };
        },
        error: (error) => {
          console.error('Error adding ICD code:', error);
        }
      });
    }
  }

  deleteCode(code: string) {
    this.icdService.deleteICDCode(code).subscribe({
      error: (error) => {
        console.error('Error deleting ICD code:', error);
      }
    });
  }
}