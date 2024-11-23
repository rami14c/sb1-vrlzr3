import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ICDCode {
  code: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class ICDService {
  private apiUrl = `${environment.apiUrl}/icd`;
  private icdCodesSubject = new BehaviorSubject<ICDCode[]>([]);

  constructor(private http: HttpClient) {
    this.loadICDCodes();
  }

  private loadICDCodes() {
    this.http.get<ICDCode[]>(this.apiUrl)
      .subscribe({
        next: (codes) => this.icdCodesSubject.next(codes),
        error: (error) => console.error('Error loading ICD codes:', error)
      });
  }

  getICDCodes(): Observable<ICDCode[]> {
    return this.icdCodesSubject.asObservable();
  }

  addICDCode(code: ICDCode): Observable<ICDCode> {
    return this.http.post<ICDCode>(this.apiUrl, code).pipe(
      tap(() => this.loadICDCodes())
    );
  }

  deleteICDCode(code: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${code}`).pipe(
      tap(() => this.loadICDCodes())
    );
  }

  validateCode(code: string): boolean {
    return this.http.get<boolean>(`${this.apiUrl}/validate/${code}`)
      .pipe(
        tap(response => response.valid)
      );
  }
}