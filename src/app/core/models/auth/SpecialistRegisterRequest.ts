export interface SpecialistRegisterRequest {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  address: string;
  speciality: string;
  qualifications: string;
  licenseNumber: string;
  yearsOfExperience: number;
  hospital?: string;
  bio?: string;
  consultationFee?: number;
  cv: File;
  idDocument: File;
}
