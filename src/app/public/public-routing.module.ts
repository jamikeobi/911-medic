import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ServicesComponent } from './services/services.component';
import { HowItWorksComponent } from './how-it-works/how-it-works.component';
import { ContactComponent } from './contact/contact.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'how-it-works', component: HowItWorksComponent },
  { path: 'contact', component: ContactComponent },
    {
  path: 'admin/login',
  component: AdminLoginComponent
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule {}