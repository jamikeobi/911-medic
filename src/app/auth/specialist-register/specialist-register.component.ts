import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';

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

  // Keep the actual File objects
  private cvFile: File | null = null;
  private idFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.minLength(11)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      speciality: ['', Validators.required],
      qualifications: ['', Validators.required],
      licenseNumber: ['', Validators.required],
      yearsOfExperience: [null, [Validators.required, Validators.min(0)]],
      hospital: [''],
      bio: [''],
      consultationFee: [15000],
      cv: [null, Validators.required],          // will hold file name for display
      idDocument: [null, Validators.required],  // will hold file name for display
    });
  }

  get f() {
    return this.registerForm.controls;
  }

  onCVUpload(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.cvFile = file;
      this.registerForm.patchValue({ cv: file.name });
      this.registerForm.get('cv')?.updateValueAndValidity();
    }
  }

  onIDUpload(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.idFile = file;
      this.registerForm.patchValue({ idDocument: file.name });
      this.registerForm.get('idDocument')?.updateValueAndValidity();
    }
  }

  onSubmit() {
    this.submitted = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.registerForm.invalid || !this.cvFile || !this.idFile) {
      this.errorMessage = 'Please fill all required fields and upload both documents.';
      return;
    }

    this.isLoading = true;

    const val = this.registerForm.value;
    const formData = new FormData();

    formData.append('fullName', val.fullName);
    formData.append('email', val.email);
    formData.append('phone', val.phone);
    formData.append('password', val.password);
    formData.append('address', val.address);
    formData.append('speciality', val.speciality);
    formData.append('qualifications', val.qualifications);
    formData.append('licenseNumber', val.licenseNumber);
    formData.append('yearsOfExperience', String(val.yearsOfExperience));
    formData.append('hospital', val.hospital || '');
    formData.append('bio', val.bio || '');
    formData.append('consultationFee', String(val.consultationFee || 15000));

    // Real files
    formData.append('cv', this.cvFile);
    formData.append('idDocument', this.idFile);

    this.authService.registerSpecialists(formData).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.successMessage =
          res.message ||
          'Registration submitted! Your application is under review.';
        
        // Optional: clear form
        this.registerForm.reset({ consultationFee: 15000 });
        this.cvFile = null;
        this.idFile = null;
        this.submitted = false;

        // Redirect after a short delay
        setTimeout(() => {
          this.router.navigate(['/auth/specialist/login']); // adjust route if different
        }, 3000);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage =
          err.error?.message ||
          err.message ||
          'Registration failed. Please try again.';
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