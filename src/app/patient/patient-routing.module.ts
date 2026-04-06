import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PatientLoginComponent } from '../auth/patient-login/patient-login.component';
import { PatientRegisterComponent } from '../auth/patient-register/patient-register.component';
import { ConsultationBookingComponent } from './consultation-booking/consultation-booking.component';
import { AmbulanceRequestComponent } from './ambulance-request/ambulance-request.component';
import { HospitalBookingComponent } from './hospital-booking/hospital-booking.component';

const routes: Routes = [
  { path: '', component: DashboardComponent }, // /patient → dashboard
  { path: 'login', component: PatientLoginComponent }, // /patient/login
  { path: 'register', component: PatientRegisterComponent }, // /patient/register
  { path: 'consultation-booking', component: ConsultationBookingComponent },
  { path: 'ambulance-request', component: AmbulanceRequestComponent },
  { path: 'hospital-booking', component: HospitalBookingComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientRoutingModule {}