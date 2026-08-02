import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../core/services/auth/auth.service';
import { User } from 'src/app/core/models/auth/User';
import { Router } from '@angular/router';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  // Simulate logged-in user (replace with real auth service later)
  isLoggedIn = false; // Change to true for testing
  userName = ''; // Replace with real user name
  userRole: string | null = null;
  private authSub!: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Subscribe to auth state changes so the navbar updates instantly on login/logout
    // without needing a page refresh
    this.authSub = this.authService.currentUser$.subscribe(
      (user: User | null) => {
        this.isLoggedIn = !!user; // Update login state
        this.userName = user ? user.fullName : ''; // Update user name
        this.userRole = user ? user.role : null; // Update user role
      },
    );
  }

  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
  }

  // Closes Bootstrap dropdown first, then navigates
  // Bootstrap leaves a lingering backdrop/state that blocks subsequent routerLink clicks
  navigate(path: string): void {
    console.log('navigate called with:', path);
    console.log('current url:', this.router.url);

    document.querySelectorAll('.dropdown-menu.show').forEach((el) => {
      el.classList.remove('show');
    });
    document.querySelectorAll('.dropdown-toggle.show').forEach((el) => {
      el.classList.remove('show');
      el.setAttribute('aria-expanded', 'false');
    });

    this.router.navigate([path]).then((result) => {
      console.log('navigation result:', result);
      console.log('url after navigation:', this.router.url);
    });
  }

  logout(): void {
    this.authService.logout();
  }

  // Returns the correct dashboard route based on the user's role
  get dashboardRoute(): string {
    return `/${this.userRole}`; // e.g., /patient, /specialist, /admin
  }
}