import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // needed for routerLink in Navbar/Footer

import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { EmergencyBannerComponent } from './emergency-banner/emergency-banner.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { PaymentModalComponent } from './payment-modal/payment-modal.component';

@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    EmergencyBannerComponent,
    LoadingSpinnerComponent,
    PaymentModalComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    NavbarComponent,
    FooterComponent,
    EmergencyBannerComponent,
    LoadingSpinnerComponent,
    PaymentModalComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ]
})
export class SharedModule { }
