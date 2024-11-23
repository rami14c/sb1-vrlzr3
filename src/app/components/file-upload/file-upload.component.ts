import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ICDService } from '../../services/icd.service';
import * as XLSX from 'xlsx';

interface ExcelData {
  [key: string]: string | number | boolean | null;
}

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  template: `
    <div class="container">
      <h1 class="page-title">File Upload & Validation</h1>
      <div class="card">
        <div class="upload-section">
          <div class="upload-box" [class.has-file]="fileUploaded" [class.has-error]="errorMessage">
            <input
              type="file"
              (change)="onFileSelected($event)"
              accept=".xlsx,.xml"
              class="file-input"
              id="file-input"
            />
            <label for="file-input" class="upload-label">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              <span>Drop your file here or click to browse</span>
            </label>
          </div>
          <p class="help-text">Supported formats: Excel (.xlsx) and XML (.xml)</p>
          
          <div *ngIf="errorMessage" class="error-message">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12" y2="16"/>
            </svg>
            {{ errorMessage }}
          </div>

          <div *ngIf="fileUploaded && !errorMessage" class="validation-results">
            <div class="success-message">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              File processed successfully!
            </div>

            <div class="data-table-container" *ngIf="excelData.length > 0">
              <h2 class="table-title">File Contents</h2>
              <div class="table-wrapper">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th *ngFor="let header of tableHeaders">{{ header }}</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let row of excelData">
                      <td *ngFor="let header of tableHeaders">{{ row[header] }}</td>
                      <td [class.valid-code]="isValidICD(row['icd_code'])" 
                          [class.invalid-code]="!isValidICD(row['icd_code'])">
                        {{ isValidICD(row['icd_code']) ? 'Valid' : 'Invalid' }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <button class="btn btn-primary" (click)="downloadValidated()">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Download Validated File
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .upload-section {
      max-width: 1000px;
      margin: 0 auto;
    }
    .upload-box {
      border: 2px dashed var(--border-color);
      border-radius: 12px;
      padding: 40px;
      text-align: center;
      position: relative;
      transition: all 0.2s;
    }
    .upload-box:hover {
      border-color: var(--primary-color);
    }
    .upload-box.has-error {
      border-color: #ef4444;
      background-color: #fee2e2;
    }
    .file-input {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      opacity: 0;
      cursor: pointer;
    }
    .upload-label {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      color: var(--text-secondary);
    }
    .help-text {
      text-align: center;
      color: var(--text-secondary);
      font-size: 0.875rem;
      margin-top: 12px;
    }
    .validation-results {
      margin-top: 24px;
    }
    .has-file {
      border-color: var(--success-color);
      background-color: #f0fdf4;
    }
    .data-table-container {
      margin: 24px 0;
      background: white;
      border-radius: 8px;
      box-shadow: var(--card-shadow);
    }
    .table-title {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 16px;
      padding: 16px;
      border-bottom: 1px solid var(--border-color);
    }
    .table-wrapper {
      overflow-x: auto;
      max-height: 400px;
      overflow-y: auto;
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.875rem;
    }
    .data-table th {
      background: #f8fafc;
      padding: 12px 16px;
      text-align: left;
      font-weight: 600;
      color: var(--text-primary);
      position: sticky;
      top: 0;
      z-index: 1;
      border-bottom: 1px solid var(--border-color);
    }
    .data-table td {
      padding: 12px 16px;
      border-bottom: 1px solid var(--border-color);
      color: var(--text-secondary);
    }
    .data-table tbody tr:hover {
      background-color: #f8fafc;
    }
    .error-message {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 16px;
      padding: 12px 16px;
      border-radius: 8px;
      background-color: #fee2e2;
      color: #991b1b;
    }
    .valid-code {
      color: #16a34a !important;
      font-weight: 500;
    }
    .invalid-code {
      color: #dc2626 !important;
      font-weight: 500;
    }
  `]
})
export class FileUploadComponent {
  fileUploaded = false;
  excelData: ExcelData[] = [];
  tableHeaders: string[] = [];
  errorMessage: string | null = null;

  constructor(private icdService: ICDService) {}

  onFileSelected(event: Event) {
    this.errorMessage = null;
    this.fileUploaded = false;
    this.excelData = [];
    this.tableHeaders = [];

    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];

    if (!file) {
      this.errorMessage = 'No file selected';
      return;
    }

    if (!this.isValidFileType(file)) {
      this.errorMessage = 'Invalid file type. Please upload an Excel (.xlsx) or XML (.xml) file';
      return;
    }

    try {
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        try {
          if (!e.target?.result) {
            throw new Error('Failed to read file');
          }

          const data = new Uint8Array(e.target.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          
          if (!workbook.SheetNames.length) {
            throw new Error('No sheets found in the workbook');
          }

          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet) as ExcelData[];
          
          if (!jsonData.length) {
            throw new Error('No data found in the sheet');
          }

          this.excelData = jsonData;
          this.tableHeaders = Object.keys(jsonData[0]);
          this.fileUploaded = true;
        } catch (error) {
          this.errorMessage = error instanceof Error ? error.message : 'Failed to process file';
          this.fileUploaded = false;
        }
      };

      reader.onerror = () => {
        this.errorMessage = 'Error reading file';
        this.fileUploaded = false;
      };

      reader.readAsArrayBuffer(file);
    } catch (error) {
      this.errorMessage = 'Failed to process file';
      this.fileUploaded = false;
    }
  }

  private isValidFileType(file: File): boolean {
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/xml',
      '.xlsx',
      '.xml'
    ];
    return validTypes.some(type => file.type === type || file.name.toLowerCase().endsWith(type));
  }

  isValidICD(code: string): boolean {
    return this.icdService.validateCode(code);
  }

  downloadValidated() {
    try {
      const validatedData = this.excelData.map(row => ({
        ...row,
        validation_status: this.isValidICD(row['icd_code'] as string) ? 'Valid' : 'Invalid'
      }));

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(validatedData);
      XLSX.utils.book_append_sheet(wb, ws, 'Validated Data');
      XLSX.writeFile(wb, 'validated_data.xlsx');
    } catch (error) {
      this.errorMessage = 'Failed to download file';
    }
  }
}