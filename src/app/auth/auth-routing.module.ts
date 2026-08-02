import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { PatientRegisterComponent } from './patient-register/patient-register.component';
import { PatientLoginComponent } from './patient-login/patient-login.component';
import { SpecialistRegisterComponent } from './specialist-register/specialist-register.component';
import { SpecialistLoginComponent } from './specialist-login/specialist-login.component';

const routes: Routes = [
  { path: '', component: AuthComponent },
  { path: 'patient/register', component: PatientRegisterComponent },
  { path: 'patient/login', component: PatientLoginComponent },
  { path: 'specialist/register', component: SpecialistRegisterComponent },
  { path: 'specialist/login', component: SpecialistLoginComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
