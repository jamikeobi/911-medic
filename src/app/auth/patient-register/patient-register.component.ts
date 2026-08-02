import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PatientRegisterRequest } from 'src/app/core/models/auth/PatientRegisterRequest';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-patient-register',
  templateUrl: './patient-register.component.html',
  styleUrls: ['./patient-register.component.css'],
})
export class PatientRegisterComponent {
  registerForm: FormGroup;
  submitted = false;
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
  ) {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern('^[+]?[0-9]{10,15}$')]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      age: ['', [Validators.required, Validators.min(1)]],
      location: ['', Validators.required],
      gender: ['', Validators.required],
    });
  }

  get f() {
    return this.registerForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.registerForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    const payload: PatientRegisterRequest = {
      fullName: this.f['fullName'].value,
      phone: this.f['phone'].value,
      email: this.f['email'].value,
      password: this.f['password'].value,
      age: this.f['age'].value,
      location: this.f['location'].value,
      gender: this.f['gender'].value,
    };

    this.authService.registerPatients(payload).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Registration successful! Redirecting to login...';
        setTimeout(() => {
          this.router.navigate(['/auth/patient/login']);
        }, 3000);
      },
      error: (err: any) => {
        this.errorMessage =
          err.error?.message || 'Registration failed. Please try again.';
        this.isLoading = false;
      },
    });
  }

  closeSuccess(): void {
    this.successMessage = '';
  }

  closeError(): void {
    this.errorMessage = '';
  }
}