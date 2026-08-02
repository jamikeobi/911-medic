import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    const token = this.authService.token; // get the token from the auth service

    // Clone request and attach token if it exists
    const authReq = token
      ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : request;

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // if the error status is 401, it means the token is invalid or expired
          this.authService.logout(); // logout the user
          this.router.navigate(['/login']); // navigate to the login page
        }
        throw error; // rethrow the error so that it can be handled by other interceptors or components
      }),
    );
  }
}
