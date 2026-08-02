import { Component, AfterViewInit, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  ConsultationService
} from 'src/app/core/services/consultation/consultation.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { BookConsultationRequest } from 'src/app/core/models/consultation/BookConsultationRequest';

declare var bootstrap: any;

@Component({
  selector: 'app-consultation-booking',
  templateUrl: './consultation-booking.component.html',
  styleUrls: ['./consultation-booking.component.css'],
})
export class ConsultationBookingComponent implements OnInit, AfterViewInit {
  bookingForm: FormGroup;
  submitted = false;
  isLoading = false;
  successMessage = '';
  errorMessage = '';
  paymentMethod = '';
  paymentCompleted = false;
  paymentReference = '';
  currentUserEmail = '';

  // Specialist ID map — in production this comes from the specialists API
  // For now mapped from the dropdown values
  specialistIdMap: { [key: string]: string } = {};

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private consultationService: ConsultationService,
    private authService: AuthService,
  ) {
    this.bookingForm = this.fb.group({
      patientName: ['', [Validators.required, Validators.minLength(2)]],
      patientPhone: [
        '',
        [Validators.required, Validators.pattern('^[+]?[0-9]{10,15}$')],
      ],
      patientEmail: ['', [Validators.required, Validators.email]],
      age: ['', [Validators.required, Validators.min(1)]],
      gender: ['', Validators.required],
      location: ['', Validators.required],
      forWhom: ['self', Validators.required],
      otherPerson: [''],
      consultationType: ['', Validators.required],
      specialistId: ['', Validators.required],
      specialty: [''],
      timeframe: ['', Validators.required],
      description: [''],
      paymentMethod: ['', Validators.required],
      receipt: [null],
    });
  }

  get f() {
    return this.bookingForm.controls;
  }

  ngOnInit(): void {
    // Pre-fill patient info from logged-in user
    const user = this.authService.currentUser;
    if (user) {
      this.currentUserEmail = user.email;
      this.bookingForm.patchValue({
        patientName: user.fullName,
        patientEmail: user.email,
        patientPhone: user.phone,
      });
    }
  }

  ngAfterViewInit(): void {}

  getAmountForSpecialist(specialistKey: string): number {
    const priceMap: { [key: string]: number } = {
      'cardiologist-online': 15000,
      'dermatologist-online': 15000,
      'mental-health-online': 15000,
      'pediatrician-online': 15000,
      'gynecologist-online': 15000,
      'dietician-online': 10000,
      'cardiologist-physical': 30000,
      'neuro-surgeon-physical': 30000,
      'urologist-physical': 30000,
      'oncologist-physical': 30000,
      'pediatrician-physical': 30000,
      'gynecologist-physical': 30000,
    };
    return priceMap[specialistKey] || 0;
  }

  onPaymentMethodChange(method: string): void {
    this.paymentMethod = method;
    if (method !== 'paystack') {
      this.paymentCompleted = false;
      this.paymentReference = '';
    }
  }

  // Called by app-payment-modal (click)="paymentSuccess.emit(...)"
  onPaymentSuccess(result: any): void {
    this.paymentCompleted = true;
    this.paymentReference = result.reference;

    // Close modal
    const modalEl = document.getElementById('paymentModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal?.hide();
  }

  onPaymentClosed(): void {
    console.log('Payment window closed by user');
  }

  onSubmit(): void {
    this.submitted = true;
    this.bookingForm.markAllAsTouched();
    if (this.bookingForm.invalid) return;

    if (this.paymentMethod === 'paystack' && !this.paymentCompleted) {
      this.errorMessage =
        'Please complete the Paystack payment before submitting.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const val = this.bookingForm.value;
    const specialistKey = val.specialistId;
    const amount = this.getAmountForSpecialist(specialistKey);

    // Extract specialty from the specialist key
    const specialty = specialistKey.split('-')[0];

    const payload: BookConsultationRequest = {
      specialistId: val.specialistId, // In real app, this is a MongoDB ObjectId from specialists API
      patientName: val.patientName,
      patientEmail: val.patientEmail,
      patientPhone: val.patientPhone,
      age: val.age,
      gender: val.gender,
      location: val.location,
      forWhom: val.forWhom,
      otherPerson: val.otherPerson || undefined,
      consultationType: val.consultationType,
      specialty,
      timeframe: val.timeframe,
      description: val.description || undefined,
      amount,
      paymentMethod: val.paymentMethod,
      transactionRef: this.paymentReference || undefined,
    };

    this.consultationService.bookConsultation(payload).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage =
          'Booking successful! You will receive a confirmation email shortly.';
        setTimeout(() => this.router.navigate(['/patient/dashboard']), 3000);
      },
      error: (err) => {
        this.errorMessage =
          err.error?.message || 'Booking failed. Please try again.';
        this.isLoading = false;
      },
    });
  }

  openPaymentModal(): void {
    setTimeout(() => {
      const modalEl = document.getElementById('paymentModal');
      if (modalEl) {
        const existing = bootstrap.Modal.getInstance(modalEl);
        existing?.dispose();
        new bootstrap.Modal(modalEl).show();
      }
    }, 0);
  }

  onReceiptUpload(event: any): void {
    const file = event.target.files[0];
    if (file) this.bookingForm.patchValue({ receipt: file });
  }
}
