import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BookConsultationRequest } from '../../models/consultation/BookConsultationRequest';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConsultationService {
  private apiUrl = `${environment.apiUrl}/consultations`;

  constructor(private http: HttpClient) {}

  bookConsultation(data: BookConsultationRequest): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  getMyConsultations(): Observable<any> {
    return this.http.get(`${this.apiUrl}/my-consultations`);
  }

  getConsultation(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  cancelConsultation(id: string, reason: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/cancel`, { reason });
  }
}
