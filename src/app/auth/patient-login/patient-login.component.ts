import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginRequest } from 'src/app/core/models/auth/LoginRequest';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-patient-login',
  templateUrl: './patient-login.component.html',
  styleUrls: ['./patient-login.component.css'],
})
export class PatientLoginComponent {
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
    })
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    const credentials: LoginRequest = {
      email: this.f['email'].value,
      password: this.f['password'].value,
      role: 'patient', // hardcoded — this is the patient login component
    };

    this.authService.login(credentials).subscribe({
      next: () => {
        // AuthService.login() already saves token + user to localStorage
        // and updates currentUser$ — no manual storage needed here
        this.successMessage = 'Login successful! Redirecting...';
        this.isLoading = false;
        setTimeout(() => {
          this.router.navigate(['/patient']);
        }, 1500);
      },
      error: (err) => {
        // err.error.message comes from your Express AppError response shape
        this.errorMessage =
          err.error?.message || 'Login failed. Please try again.';
        this.isLoading = false;
      },
    });
  }

  // Close message handlers
  closeSuccess() {
    this.successMessage = '';
  }

  closeError() {
    this.errorMessage = '';
  }
}
