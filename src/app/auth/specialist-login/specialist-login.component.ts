import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service'; // adjust path if needed
import { LoginRequest } from 'src/app/core/models/auth/LoginRequest';

@Component({
  selector: 'app-specialist-login',
  templateUrl: './specialist-login.component.html',
  styleUrls: ['./specialist-login.component.css'],
})
export class SpecialistLoginComponent {
  loginForm: FormGroup;
  submitted = false;
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
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
    this.successMessage = '';

    if (this.loginForm.invalid) return;

    this.isLoading = true;

    const payload: LoginRequest = {
      ...this.loginForm.value,
      role: 'specialist',
    };

    this.authService.login(payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.successMessage = res.message || 'Login successful! Redirecting...';

        // AuthService already stored token + user in localStorage
        // and updated currentUserSubject

        setTimeout(() => {
          this.router.navigate(['/specialist']); // or '/specialist/dashboard'
        }, 1200);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage =
          err.error?.message ||
          err.message ||
          'Login failed. Please check your credentials.';
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
