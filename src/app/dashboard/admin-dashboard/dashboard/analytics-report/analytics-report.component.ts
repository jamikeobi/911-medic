import {
  ChangeDetectorRef,
  Component,
  HostListener,
  OnInit,
} from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { AdminService } from 'src/app/core/services/admin/admin.service';
import { AdminAnalytics } from 'src/app/core/models/admin/admin-analytics.model';

@Component({
  selector: 'app-analytics-report',
  templateUrl: './analytics-report.component.html',
  styleUrls: ['./analytics-report.component.css'],
})
export class AnalyticsReportComponent implements OnInit {
  analytics: AdminAnalytics | null = null;
  role: 'owner' | 'staff' | null = null;
  showRevenueChart = false;
  loading = true;

  // Line Chart – Monthly Revenue
  lineChartData: ChartData<'line'> = { labels: [], datasets: [] };
  lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: '#ffffff' } } },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        ticks: {
          color: '#ffffff',
          callback: (value) => '₦' + value,
        },
      },
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        ticks: { color: '#ffffff' },
      },
    },
  };
  lineChartType: ChartType = 'line';

  // Pie Chart – Specialist Distribution
  pieChartData: ChartData<'pie'> = { labels: [], datasets: [] };
  pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: '#ffffff' } } },
  };
  pieChartType: ChartType = 'pie';

  // Bar Chart – Consultation Status (derived from backend numbers)
  consultationStatusData: ChartData<'bar'> = { labels: [], datasets: [] };
  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: '#ffffff' } } },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        ticks: { color: '#ffffff' },
      },
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        ticks: { color: '#ffffff' },
      },
    },
  };
  barChartType: ChartType = 'bar';

  constructor(
    private adminService: AdminService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.role = this.adminService.getRole();
    this.loadAnalytics();
  }

  loadAnalytics() {
    this.loading = true;

    this.adminService.getAnalytics().subscribe({
      next: (data) => {
        this.analytics = data;
        this.showRevenueChart = this.role === 'owner';

        // ---------- Monthly Revenue Line Chart ----------
        const monthNames = [
          '',
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ];

        this.lineChartData = {
          labels: (data.monthlyRevenue || []).map(
            (m) => monthNames[m.month] || `M${m.month}`,
          ),
          datasets: [
            {
              label: 'Revenue (₦)',
              data: (data.monthlyRevenue || []).map((m) => m.revenue),
              borderColor: '#0d6efd',
              backgroundColor: 'rgba(13, 110, 253, 0.15)',
              fill: true,
              tension: 0.3,
            },
          ],
        };

        // ---------- Specialist Distribution Pie ----------
        this.pieChartData = {
          labels: data.specialistDistribution?.labels || [],
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
                '#6610f2',
              ],
            },
          ],
        };

        // ---------- Consultation Status Bar (only what backend gives) ----------
        this.consultationStatusData = {
          labels: ['Completed', 'Active / Ongoing'],
          datasets: [
            {
              label: 'Consultations',
              data: [
                data.completedConsultations || 0,
                data.activeConsultations || 0,
              ],
              backgroundColor: ['#28a745', '#17a2b8'],
            },
          ],
        };

        this.loading = false;
        this.cdr.detectChanges();

        setTimeout(() => window.dispatchEvent(new Event('resize')), 100);
      },
      error: (err) => {
        console.error('Failed to load analytics', err);
        this.loading = false;
      },
    });
  }

  @HostListener('window:resize')
  onWindowResize() {
    if (this.lineChartData.datasets.length) {
      this.lineChartData = { ...this.lineChartData };
    }
    if (this.pieChartData.datasets.length) {
      this.pieChartData = { ...this.pieChartData };
    }
    if (this.consultationStatusData.datasets.length) {
      this.consultationStatusData = { ...this.consultationStatusData };
    }
  }
}
