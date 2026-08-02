
export interface LoginRequest {
  email: string;
  password: string;
  role: 'patient' | 'specialist' | 'admin';
}
