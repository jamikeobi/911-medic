import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';


export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const expectedRole = route.data['role'] as string; // 
  const userRole = authService.userRole;


  if (userRole === expectedRole) return true;
  
  //Redirect to the appropriate dashboard based on the user's role
  if (userRole) {
    router.navigate([`/${userRole}`]); // Redirect to the user's dashboard based on their role  
  } else {
    router.navigate(['/auth/login']); // Redirect to login if the user is not logged in
  }
  return false;
};
