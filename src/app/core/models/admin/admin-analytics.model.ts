// src/app/core/models/admin/admin-analytics.model.ts

export interface MonthlyRevenue {
  month: number;
  revenue: number;
}

export interface SpecialistDistribution {
  labels: string[];
  data: number[];
  // optional Chart.js shape some components expect
  datasets?: { data: number[]; label?: string; backgroundColor?: string[] }[];
}

export interface TopSpecialist {
  name: string;
  specialty: string;
  consultations: number;
  rating: number;
  revenue: number;
}

export interface RevenueBreakdown {
  online: number;
  physical: number;
  emergency: number;
}

export interface ConsultationSummary {
  total: number;
  completed: number;
  pending: number;
  ongoing: number;
  cancelled: number;
}

export interface AdminAnalytics {
  // core numbers from backend
  totalSpecialists: number;
  pendingApprovals: number;
  activeConsultations: number;
  completedConsultations: number;
  totalRevenue: number;
  totalPatients: number;

  monthlyRevenue: MonthlyRevenue[];
  specialistDistribution: SpecialistDistribution;
  topSpecialists: TopSpecialist[];
  recentEmergencies: any[];

  // extra shapes the existing components expect
  revenueBreakdown?: RevenueBreakdown;
  consultationSummary?: ConsultationSummary;

  // legacy aliases some components still use
  revenue?: { total: number };
  patients?: { total: number };
}