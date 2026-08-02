import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';import { User } from 'src/app/core/models/auth/User';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  private userSub!: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Subscribe to the currentUser$ observable to get the logged-in user
    this.userSub = this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;

      if (!user) {
        // not logged in → redirect
        this.router.navigate(['/auth/patient/login']); // or whatever your login route is
      }
    });
  }

  ngOnDestroy(): void {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
