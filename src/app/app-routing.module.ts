import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { authGuard } from './core/guard/auth/auth.guard';
import { roleGuard } from './core/guard/role/role.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./public/public.module').then(m => m.PublicModule)
  },

  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth.module').then(m => m.AuthModule)
  },

  {
    path: 'patient',
    canActivate: [authGuard, roleGuard],
    data:{role: 'patient'},
    loadChildren: () =>
      import('./patient/patient.module').then(m => m.PatientModule)
  },

  {
    path: 'specialist',
    canActivate: [authGuard, roleGuard],
    data:{role: 'specialist'},
    loadChildren: () =>
      import('./specialist/specialist.module').then(m => m.SpecialistModule)
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data:{role: 'admin'},
    loadChildren: () =>
      import('./dashboard/admin-dashboard/admin-dashboard.module').then(m => m.AdminDashboardModule)
  },

  // Fallback
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
