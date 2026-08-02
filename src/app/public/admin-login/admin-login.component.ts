import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { LoginRequest } from 'src/app/core/models/auth/LoginRequest';
@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css'],
})
export class AdminLoginComponent {
  loginForm: FormGroup;
  submitted = false;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.errorMessage = '';

    if (this.loginForm.invalid) return;

    this.isLoading = true;

    const payload: LoginRequest = {
      ...this.loginForm.value,
      role: 'admin', // ← hard-coded for this page
    };

    this.authService.login(payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.successMessage = 'Login successful! Redirecting...';

        // AuthService already saved token + user
        setTimeout(() => {
          this.router.navigate(['/admin']); // → protected by authGuard + roleGuard
        }, 1000);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Invalid admin credentials';
      },
    });
  }



  
  closeSuccess() {
    this.successMessage = '';
  }

  closeError() {
    this.errorMessage = '';
  }
  
}
