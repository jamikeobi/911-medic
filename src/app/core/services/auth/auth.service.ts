import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface User {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  role: 'patient' | 'specialist' | 'admin';
}

export interface AuthResponse {
  status: string;
  token: string;
  data: { user: User };
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  // BehaviorSubject holds current user state...any componrnt can subscribe to it and get the current user state
  private currentUserSubject = new BehaviorSubject<User | null>(
    this.getUserFromStorage() // get the user from local storage when the service is initialized
  );

  currentUser$ = this.currentUserSubject.asObservable(); // expose the current user as an observable


  constructor(private http: HttpClient, private router: Router) { }

  // Getters

  get currentUser(): User | null{
    return this.currentUserSubject.value; // return the current user value from the BehaviorSubject
  }

  get token(): string | null {
    return localStorage.getItem('token'); // return the token from local storage
  }

  get isLoggedIn(): boolean {
    return  !!this.token && !!this.currentUser; // return true if there is a token and a current user, otherwise return false
  }

  get userRole(): 'patient' | 'specialist' | 'admin' | null { 
    return this.currentUser?.role ?? null; // return the role of the current user if it exists, otherwise return null
  }


  // Auth Methods

  // Login
  login(email: string, password: string, role: string): Observable<AuthResponse>{
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password, role }).pipe(
      tap(res => { // this is to set the response token and user as values in the local storage and update the current user state
        localStorage.setItem('token', res.token); // this is to set the response token as a value under key "token" in the local storage
        localStorage.setItem('user', JSON.stringify(res.data.user));
        this.currentUserSubject.next(res.data.user);
      })
    );
  }


  // Register Patients
  registerPatients(data: any): Observable<any>{
    return this.http.post(`${this.apiUrl}/patient/register`, data); // this is to send a post request to the backend to register a patient
  }


  registerSpecialists(data: FormData): Observable<any>{
    return this.http.post(`${this.apiUrl}/specialist/register`, data); // this is to send a post request to the backend to register a specialist
  }
  




  // Helpers
  private getUserFromStorage(): User | null { 
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null; // this will return the user object if it exists in local storage, otherwise it will return null
    } catch {
      return null; // if there's an error parsing the user from local storage, return null
    }
  }
}
