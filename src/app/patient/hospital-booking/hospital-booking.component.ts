import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

interface Hospital {
  id: string;
  name: string;
  location: string;
  area: string;
  services: string[];
  phone: string;
  rating: number;
}



@Component({
  selector: 'app-hospital-booking',
  templateUrl: './hospital-booking.component.html',
  styleUrls: ['./hospital-booking.component.css'],
})
export class HospitalBookingComponent implements OnInit{
  hospitals: Hospital[] = [];
  filteredHospitals: Hospital[] = [];
  selectedArea: string = '';
  areas: string[] = [];

  // Selected hospital for booking
  selectedHospital: Hospital | null = null;
  showBookingModal = false;

  // Booking form
  bookingForm: FormGroup;
  submitted = false;
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  // Current user
  currentUser: any = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.bookingForm = this.fb.group({
      patientName: ['', Validators.required],
      patientEmail: ['', [Validators.required, Validators.email]],
      patientPhone: [
        '',
        [Validators.required, Validators.pattern('^[+]?[0-9]{10,15}$')],
      ],
      hospitalName: ['', Validators.required],
      hospitalLocation: ['', Validators.required],
      reason: ['', Validators.required],
      preferredDate: ['', Validators.required],
      preferredTime: ['', Validators.required],
      additionalInfo: [''],
    });
  }

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadHospitals();
  }

  loadCurrentUser(): void {
    const user = localStorage.getItem('currentUser');
    if (user) {
      this.currentUser = JSON.parse(user);
      // Pre-fill form with user data
      this.bookingForm.patchValue({
        patientName: this.currentUser.fullName || '',
        patientEmail: this.currentUser.email || '',
        patientPhone: this.currentUser.phone || '',
      });
    }
  }

  loadHospitals(): void {
    this.hospitals = [
      // ETI-OSA (Victoria Island, Lekki, Ikoyi)
      {
        id: 'hosp-001',
        name: 'Reddington Hospital',
        location: 'Victoria Island',
        area: 'ETI-OSA',
        services: ['Cardiology', 'Neurology', 'Pediatrics', 'Emergency'],
        phone: '+234 812 345 6789',
        rating: 4.5,
      },
      {
        id: 'hosp-002',
        name: 'Kelina Hospital Lagos',
        location: 'Lekki',
        area: 'ETI-OSA',
        services: ['General Medicine', 'Surgery', 'Maternity'],
        phone: '+234 803 456 7890',
        rating: 4.3,
      },
      {
        id: 'hosp-003',
        name: 'Evercare Hospital Lekki',
        location: 'Lekki',
        area: 'ETI-OSA',
        services: ['Cardiology', 'Oncology', 'Orthopedics', 'Neurology'],
        phone: '+234 809 876 5432',
        rating: 4.7,
      },
      {
        id: 'hosp-004',
        name: 'Lagoon Hospitals',
        location: 'Ikoyi',
        area: 'ETI-OSA',
        services: ['Cardiology', 'Dermatology', 'Pediatrics'],
        phone: '+234 802 345 6789',
        rating: 4.4,
      },
      {
        id: 'hosp-005',
        name: 'St. Nicholas Hospital',
        location: 'Lagos Island',
        area: 'ETI-OSA',
        services: ['Cardiology', 'Surgery', 'Maternity'],
        phone: '+234 805 678 9012',
        rating: 4.6,
      },

      // IKEJA
      {
        id: 'hosp-006',
        name: 'Eko Hospital Ikeja',
        location: 'Ikeja',
        area: 'IKEJA',
        services: ['Cardiology', 'Neurology', 'Pediatrics', 'Emergency'],
        phone: '+234 807 890 1234',
        rating: 4.5,
      },
      {
        id: 'hosp-007',
        name: 'St. Ives Specialist Hospital',
        location: 'Ikeja',
        area: 'IKEJA',
        services: ['Cardiology', 'Dermatology', 'Ophthalmology'],
        phone: '+234 810 234 5678',
        rating: 4.4,
      },
      {
        id: 'hosp-008',
        name: 'Skymed Hospital',
        location: 'Ikeja',
        area: 'IKEJA',
        services: ['General Medicine', 'Surgery', 'Pediatrics'],
        phone: '+234 803 123 4567',
        rating: 4.2,
      },
      {
        id: 'hosp-009',
        name: 'Finnih Medical Centre',
        location: 'Ikeja',
        area: 'IKEJA',
        services: ['Cardiology', 'Neurology', 'Emergency'],
        phone: '+234 809 345 6789',
        rating: 4.3,
      },

      // LAGOS ISLAND
      {
        id: 'hosp-010',
        name: 'St. Nicholas Hospital',
        location: 'Lagos Island',
        area: 'LAGOS ISLAND',
        services: ['Cardiology', 'Surgery', 'Maternity'],
        phone: '+234 805 678 9012',
        rating: 4.6,
      },
      {
        id: 'hosp-011',
        name: 'Lagoon Hospital Apapa',
        location: 'Apapa',
        area: 'LAGOS ISLAND',
        services: ['General Medicine', 'Pediatrics', 'Emergency'],
        phone: '+234 802 456 7890',
        rating: 4.3,
      },

      // SURULERE
      {
        id: 'hosp-012',
        name: 'Marigold Hospital',
        location: 'Surulere',
        area: 'SURULERE',
        services: ['Cardiology', 'General Medicine', 'Pediatrics'],
        phone: '+234 806 789 0123',
        rating: 4.1,
      },
      {
        id: 'hosp-013',
        name: 'R-Jolad Hospital',
        location: 'Surulere',
        area: 'SURULERE',
        services: ['General Medicine', 'Surgery', 'Maternity'],
        phone: '+234 810 567 8901',
        rating: 4.2,
      },

      // KOSOFE / GBAGADA
      {
        id: 'hosp-014',
        name: 'Newgate Medical Services',
        location: 'Gbagada',
        area: 'KOSOFE / GBAGADA',
        services: ['Cardiology', 'Pediatrics', 'Emergency'],
        phone: '+234 803 678 9012',
        rating: 4.3,
      },
      {
        id: 'hosp-015',
        name: 'Ace Medicare Clinics',
        location: 'Kosofe',
        area: 'KOSOFE / GBAGADA',
        services: ['General Medicine', 'Dermatology'],
        phone: '+234 809 890 1234',
        rating: 4.0,
      },

      // SOMOLU / YABA
      {
        id: 'hosp-016',
        name: 'Paelon Memorial Hospital',
        location: 'Yaba',
        area: 'SOMOLU / YABA',
        services: ['Cardiology', 'Neurology', 'Oncology'],
        phone: '+234 807 123 4567',
        rating: 4.5,
      },
      {
        id: 'hosp-017',
        name: 'Euracare Multi-Specialist Hospital',
        location: 'Yaba',
        area: 'SOMOLU / YABA',
        services: ['Cardiology', 'Orthopedics', 'Urology'],
        phone: '+234 810 678 9012',
        rating: 4.6,
      },

      // IFako-IJAIYE / ALIMOSHO
      {
        id: 'hosp-018',
        name: 'Hamkad Hospital Limited',
        location: 'Ifako-Ijaiye',
        area: 'IFAKO-IJAIYE / ALIMOSHO',
        services: ['General Medicine', 'Pediatrics', 'Maternity'],
        phone: '+234 803 456 7890',
        rating: 4.1,
      },
      {
        id: 'hosp-019',
        name: 'Bethel Hospital',
        location: 'Alimosho',
        area: 'IFAKO-IJAIYE / ALIMOSHO',
        services: ['General Medicine', 'Emergency'],
        phone: '+234 809 234 5678',
        rating: 4.0,
      },

      // IKORODU
      {
        id: 'hosp-020',
        name: 'Ikorodu General Hospital Annex Private Wing',
        location: 'Ikorodu',
        area: 'IKORODU',
        services: ['General Medicine', 'Surgery', 'Maternity'],
        phone: '+234 805 123 4567',
        rating: 4.2,
      },
      {
        id: 'hosp-021',
        name: 'Blue Cross Hospital',
        location: 'Ikorodu',
        area: 'IKORODU',
        services: ['Cardiology', 'Pediatrics', 'Emergency'],
        phone: '+234 802 789 0123',
        rating: 4.3,
      },

      // IBEJU-LEKKI / AJAH
      {
        id: 'hosp-022',
        name: 'St. Kizito Clinic',
        location: 'Ajah',
        area: 'IBEJU-LEKKI / AJAH',
        services: ['General Medicine', 'Pediatrics'],
        phone: '+234 806 345 6789',
        rating: 4.0,
      },
      {
        id: 'hosp-023',
        name: 'Gold Cross Hospital',
        location: 'Lekki',
        area: 'IBEJU-LEKKI / AJAH',
        services: ['Cardiology', 'Emergency', 'Maternity'],
        phone: '+234 810 456 7890',
        rating: 4.4,
      },

      // Festac
      {
        id: 'hosp-024',
        name: 'De Marvel Hospital',
        location: 'Festac',
        area: 'FESTAC',
        services: ['General Medicine', 'Pediatrics', 'Surgery'],
        phone: '+234 803 901 2345',
        rating: 4.1,
      },
      {
        id: 'hosp-025',
        name: 'Golden Cross Hospital',
        location: 'Festac',
        area: 'FESTAC',
        services: ['Cardiology', 'Emergency', 'Maternity'],
        phone: '+234 809 123 4567',
        rating: 4.2,
      },

      // Satellite Town
      {
        id: 'hosp-026',
        name: 'Holy Family Hospital',
        location: 'Satellite Town',
        area: 'SATELLITE TOWN',
        services: ['General Medicine', 'Pediatrics', 'Maternity'],
        phone: '+234 805 678 9012',
        rating: 4.0,
      },
      {
        id: 'hosp-027',
        name: 'Arch Angel Hospital',
        location: 'Satellite Town',
        area: 'SATELLITE TOWN',
        services: ['General Medicine', 'Emergency'],
        phone: '+234 802 345 6789',
        rating: 3.9,
      },

      // Alaba
      {
        id: 'hosp-028',
        name: 'Sabo Crown Hospital',
        location: 'Alaba',
        area: 'ALABA',
        services: ['General Medicine', 'Pediatrics'],
        phone: '+234 810 789 0123',
        rating: 4.0,
      },
    ];

    // Extract unique areas
    this.areas = [...new Set(this.hospitals.map((h) => h.area))];
    this.filteredHospitals = this.hospitals;
  }

  filterByArea(area: string): void {
    this.selectedArea = area;
    if (area === '') {
      this.filteredHospitals = this.hospitals;
    } else {
      this.filteredHospitals = this.hospitals.filter((h) => h.area === area);
    }
  }

  selectHospital(hospital: Hospital): void {
    this.selectedHospital = hospital;
    this.bookingForm.patchValue({
      hospitalName: hospital.name,
      hospitalLocation: `${hospital.name} - ${hospital.location}, ${hospital.area}`,
    });
    this.showBookingModal = true;
  }

  closeBookingModal(): void {
    this.showBookingModal = false;
    this.selectedHospital = null;
    this.submitted = false;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.bookingForm.invalid) {
      return;
    }

    this.isLoading = true;

    // Simulate API call
    setTimeout(() => {
      const booking = {
        id: Date.now(),
        ...this.bookingForm.value,
        bookingType: 'hospital',
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      // Save to localStorage
      const hospitalBookings = JSON.parse(
        localStorage.getItem('hospitalBookings') || '[]',
      );
      hospitalBookings.push(booking);
      localStorage.setItem(
        'hospitalBookings',
        JSON.stringify(hospitalBookings),
      );

      this.successMessage =
        'Hospital booking request submitted successfully! The hospital will contact you shortly.';
      this.isLoading = false;

      setTimeout(() => {
        this.successMessage = '';
        this.closeBookingModal();
        this.router.navigate(['/patient']);
      }, 3000);
    }, 1500);
  }

  get f() {
    return this.bookingForm.controls;
  }
}
