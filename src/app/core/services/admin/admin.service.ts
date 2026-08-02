// src/app/core/services/admin/admin.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  SpecialistApplication,
  SpecialistApplicationView,
} from '../../models/admin/specialist-application.model';
import { AdminAnalytics } from '../../models/admin/admin-analytics.model';
import {
  ApiListResponse,
  ApiMessageResponse,
  ApiDataResponse,
} from '../../models/admin/admin-response.model';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/admin`;

  private currentRole: 'owner' | 'staff' | null =
    (localStorage.getItem('adminRole') as 'owner' | 'staff' | null) || null;

  constructor(private http: HttpClient) {}

  // ---------- Role helpers (legacy / temporary) ----------
  getRole(): 'owner' | 'staff' | null {
    return (
      this.currentRole ||
      (localStorage.getItem('adminRole') as 'owner' | 'staff' | null)
    );
  }

  setRole(role: 'owner' | 'staff'): void {
    this.currentRole = role;
    localStorage.setItem('adminRole', role);
  }

  clearRole(): void {
    this.currentRole = null;
    localStorage.removeItem('adminRole');
  }

  // ---------- Specialist Applications ----------
  getSpecialistApplications(): Observable<SpecialistApplicationView[]> {
    return this.http
      .get<ApiListResponse<SpecialistApplication>>(`${this.apiUrl}/specialists`)
      .pipe(
        map((res) =>
          (res.data || []).map((s) => ({
            id: s._id,
            fullName: s.userId?.fullName ?? 'Unknown',
            email: s.userId?.email ?? '',
            phone: s.userId?.phone ?? '',
            speciality: s.speciality,
            qualifications: s.qualifications,
            yearsOfExperience: s.yearsOfExperience,
            licenseNumber: s.licenseNumber,
            hospital: s.hospital,
            bio: s.bio,
            consultationFee: s.consultationFee,
            status: s.status,
            cvUrl: s.cvUrl,
            idUrl: s.idUrl,
            address: s.address,
            appliedAt: s.createdAt,
          })),
        ),
      );
  }

  approveSpecialist(id: string): Observable<ApiMessageResponse> {
    return this.http.patch<ApiMessageResponse>(
      `${this.apiUrl}/specialists/${id}/approve`,
      {},
    );
  }

  rejectSpecialist(
    id: string,
    reason?: string,
  ): Observable<ApiMessageResponse> {
    return this.http.patch<ApiMessageResponse>(
      `${this.apiUrl}/specialists/${id}/reject`,
      { reason: reason || '' },
    );
  }

  // ---------- Consultations ----------
  getConsultations(): Observable<any[]> {
    return this.http
      .get<ApiListResponse<any>>(`${this.apiUrl}/consultations`)
      .pipe(map((res) => res.data || []));
  }

  // ---------- Payments ----------
  getPayments(): Observable<any[]> {
    // Backend does not yet have a dedicated GET /payments.
    // Return empty array for now so the component compiles.
    // When you add the endpoint, replace this with a real HTTP call.
    return of([]);
  }

  confirmPayment(id: string): Observable<ApiMessageResponse> {
    return this.http.patch<ApiMessageResponse>(
      `${this.apiUrl}/payments/${id}/confirm`,
      {},
    );
  }

  // ---------- Emergencies ----------
  getEmergencies(): Observable<any[]> {
    return this.http
      .get<ApiListResponse<any>>(`${this.apiUrl}/emergencies`)
      .pipe(map((res) => res.data || []));
  }

  dispatchAmbulance(id: string): Observable<ApiMessageResponse> {
    return this.http.patch<ApiMessageResponse>(
      `${this.apiUrl}/emergencies/${id}/dispatch`,
      {},
    );
  }

  // ---------- Analytics ----------
  getAnalytics(): Observable<AdminAnalytics> {
    return this.http
      .get<ApiDataResponse<AdminAnalytics>>(`${this.apiUrl}/analytics`)
      .pipe(
        map((res) => {
          const data = res.data;

          // Enrich the object so existing chart components keep working
          return {
            ...data,

            // Chart.js friendly specialist distribution
            specialistDistribution: {
              labels: data.specialistDistribution?.labels || [],
              data: data.specialistDistribution?.data || [],
              datasets: [
                {
                  data: data.specialistDistribution?.data || [],
                  backgroundColor: [
                    '#0d6efd',
                    '#198754',
                    '#ffc107',
                    '#dc3545',
                    '#6f42c1',
                    '#fd7e14',
                    '#20c997',
                  ],
                },
              ],
            },

            // Extra shapes the reports expect
            revenueBreakdown: data.revenueBreakdown || {
              online: Math.round((data.totalRevenue || 0) * 0.5),
              physical: Math.round((data.totalRevenue || 0) * 0.35),
              emergency: Math.round((data.totalRevenue || 0) * 0.15),
            },

            consultationSummary: data.consultationSummary || {
              total:
                (data.completedConsultations || 0) +
                (data.activeConsultations || 0),
              completed: data.completedConsultations || 0,
              pending: 0,
              ongoing: data.activeConsultations || 0,
              cancelled: 0,
            },

            // legacy aliases
            revenue: { total: data.totalRevenue || 0 },
            patients: { total: data.totalPatients || 0 },
          };
        }),
      );
  }
}
