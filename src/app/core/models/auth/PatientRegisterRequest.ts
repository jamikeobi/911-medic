export interface PatientRegisterRequest {
  fullName: string;
  phone: string;
  email: string;
  password: string;
  age: number;
  location: string;
  gender: 'Male' | 'Female' | 'Other';
}
