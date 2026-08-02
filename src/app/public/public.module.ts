import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicRoutingModule } from './public-routing.module';
import { HomeComponent } from './home/home.component';
import { ServicesComponent } from './services/services.component';
import { HowItWorksComponent } from './how-it-works/how-it-works.component';
import { ContactComponent } from './contact/contact.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AdminLoginComponent } from './admin-login/admin-login.component';


@NgModule({
  declarations: [
    HomeComponent,
    ServicesComponent,
    HowItWorksComponent,
    ContactComponent,
    AdminLoginComponent
  ],
  imports: [
    CommonModule,
    PublicRoutingModule,
    ReactiveFormsModule,
     SharedModule
  ]
})
export class PublicModule { }
