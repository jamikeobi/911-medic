import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-specialist-register',
  templateUrl: './specialist-register.component.html',
  styleUrls: ['./specialist-register.component.css'],
})
export class SpecialistRegisterComponent {
  registerForm: FormGroup;
  submitted = false;
  isLoading = false;
  successMessage = '';
  errorMessage = '';
  // Simulate logged-in user (for navbar consistency)
  isLoggedIn = false;
  userName = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.minLength(11)]], // renamed from phoneNumber
      password: ['', [Validators.required, Validators.minLength(8)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      speciality: ['', Validators.required],
      qualifications: ['', Validators.required],
      licenseNumber: ['', Validators.required],
      yearsOfExperience: [null, [Validators.required, Validators.min(0)]],
      hospital: [''], // optional
      bio: [''], // optional
      consultationFee: [15000], // optional, defaults to backend default
      cv: [null, Validators.required],
      idDocument: [null, Validators.required],
    });
  }

  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    const formData = this.registerForm.value;

    // Duplicate check (by name for simplicity)
    const existing = JSON.parse(localStorage.getItem('specialists') || '[]');
    if (
      existing.some(
        (s: any) =>
          s.fullName.toLowerCase() === formData.fullName.toLowerCase(),
      )
    ) {
      this.errorMessage =
        'This name is already registered. Please login or use a different name.';
      this.isLoading = false;
      return;
    }

    // Save with pending status
    const specialist = {
      ...formData,
      status: 'pending',
      registeredAt: new Date().toISOString(),
    };

    existing.push(specialist);
    localStorage.setItem('specialists', JSON.stringify(existing));

    this.successMessage =
      'Registration submitted successfully! Your profile is pending approval. We will notify you once verified by the Admin!!.';
    this.isLoading = false;

    // Redirect to login after short delay
    setTimeout(() => {
      // this.router.navigate(['/specialist/login']);
    }, 4000);
  }

  // onSubmit() {
  //   this.submitted = true;
  //   if (this.registerForm.invalid) return;

  //   this.isLoading = true;
  //   this.errorMessage = '';

  //   // Files must go via FormData — JSON.stringify drops File objects entirely
  //   const formData = new FormData();
  //   const val = this.registerForm.value;

  //   formData.append('fullName', val.fullName);
  //   formData.append('email', val.email);
  //   formData.append('phone', val.phone);
  //   formData.append('password', val.password);
  //   formData.append('address', val.address);
  //   formData.append('speciality', val.speciality);
  //   formData.append('qualifications', val.qualifications);
  //   formData.append('licenseNumber', val.licenseNumber);
  //   formData.append('yearsOfExperience', val.yearsOfExperience);
  //   formData.append('hospital', val.hospital || '');
  //   formData.append('bio', val.bio || '');
  //   formData.append('consultationFee', val.consultationFee);

  //   if (this.cvFile) formData.append('cv', this.cvFile);
  //   if (this.idFile) formData.append('idDocument', this.idFile);

  //   // TODO: call AuthService.specialistRegister(formData) when APIs are ready
  //   console.log('Registration FormData ready');

  //   this.successMessage =
  //     'Registration submitted! Your profile is pending approval.';
  //   this.isLoading = false;

  //   setTimeout(() => {
  //     // this.router.navigate(['/specialist/login']);
  //   }, 4000);
  // }

  onCVUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.registerForm.patchValue({ cv: file.name }); // Store file name for display, actual file handling is backend's responsibility
    }
  }

  onIDUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.registerForm.patchValue({ idDocument: file.name }); // Store file name for display, actual file handling is backend's responsibility
    }
  }

  // Close message handlers
  closeSuccess() {
    this.successMessage = '';
  }

  closeError() {
    this.errorMessage = '';
  }
}
