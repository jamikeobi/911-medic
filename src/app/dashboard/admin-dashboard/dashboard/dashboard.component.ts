import { Component, OnInit, HostListener, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/core/services/admin/admin.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  role: 'owner' | 'staff' | null = null;
  sidebarOpen = true;
  isMobile = false;

  constructor(
    private adminService: AdminService,
    private router: Router,
    private renderer: Renderer2,
  ) {}

  ngOnInit() {
    this.checkScreenSize();
    this.role = this.adminService.getRole();
    // If role exists, navigate to analytics
    if (this.role) {
      this.router.navigate(['/admin/analytics']);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth < 768;
    if (this.isMobile) {
      this.sidebarOpen = false;
      // Prevent body scroll when sidebar is open on mobile
      if (this.sidebarOpen) {
        this.renderer.addClass(document.body, 'sidebar-open');
      } else {
        this.renderer.removeClass(document.body, 'sidebar-open');
      }
    } else {
      this.sidebarOpen = true;
      this.renderer.removeClass(document.body, 'sidebar-open');
    }
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
    if (this.isMobile) {
      if (this.sidebarOpen) {
        this.renderer.addClass(document.body, 'sidebar-open');
      } else {
        this.renderer.removeClass(document.body, 'sidebar-open');
      }
    }
  }

  onRoleSelected() {
    this.role = this.adminService.getRole();
    this.router.navigate(['/admin/analytics']);
  }

  logout() {
    this.adminService.clearRole();
    this.router.navigate(['/']);
  }
}
