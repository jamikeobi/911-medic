import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private apiUrl = `${environment.apiUrl}/notifications`;
  private unreadCountSubject = new BehaviorSubject<number>(0);
  unreadCount$ = this.unreadCountSubject.asObservable();

  constructor(private http: HttpClient) {}

  getNotifications(limit = 20): Observable<any> {
    return this.http
      .get(`${this.apiUrl}?limit=${limit}`)
      .pipe(tap((res: any) => this.unreadCountSubject.next(res.unreadCount)));
  }

  markAsRead(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/read`, {}).pipe(
      tap(() => {
        const current = this.unreadCountSubject.value;
        if (current > 0) this.unreadCountSubject.next(current - 1);
      }),
    );
  }

  markAllAsRead(): Observable<any> {
    return this.http
      .patch(`${this.apiUrl}/read-all`, {})
      .pipe(tap(() => this.unreadCountSubject.next(0)));
  }

  deleteNotification(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
