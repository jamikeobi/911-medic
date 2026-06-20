import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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
  // simulate auth state (kept for template parity)
  isLoggedIn = false;
  userName = '';

  constructor(
    private fb: FormBuilder,
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
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    const payload = {
      ...this.loginForm.value,
      role: 'specialist', // backend login controller requires this
    };

    // TODO: call AuthService.login(payload) when APIs are ready
    console.log('Login payload:', payload);

    this.successMessage = 'Login successful! Redirecting...';
    this.isLoading = false;

    setTimeout(() => {
      this.router.navigate(['/specialist']);
    }, 1500);
  }

  // Close message handlers
  closeSuccess() {
    this.successMessage = '';
  }

  closeError() {
    this.errorMessage = '';
  }
}
