// Auth Response Model

export interface User {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  role: 'patient' | 'specialist' | 'admin';
  isActive: boolean;
  profileImage?: string;
  createdAt: string;
}