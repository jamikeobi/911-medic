export interface PopulatedUser {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
}

export interface SpecialistApplication {
  _id: string;
  userId: PopulatedUser;
  speciality: string;
  qualifications: string;
  yearsOfExperience: number;
  licenseNumber: string;
  hospital?: string;
  bio?: string;
  consultationFee: number;
  status: 'pending' | 'approved' | 'rejected';
  cvUrl?: string;
  idUrl?: string;
  address?: string;
  rating?: number;
  totalConsultations?: number;
  createdAt: string;
  updatedAt: string;
}

// Flattened version the component can use easily
export interface SpecialistApplicationView {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  speciality: string;
  qualifications: string;
  yearsOfExperience: number;
  licenseNumber: string;
  hospital?: string;
  bio?: string;
  consultationFee: number;
  status: 'pending' | 'approved' | 'rejected';
  cvUrl?: string;
  idUrl?: string;
  address?: string;
  appliedAt: string;
}