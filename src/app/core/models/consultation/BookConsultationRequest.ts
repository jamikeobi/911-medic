export interface BookConsultationRequest {
  specialistId: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  age: number;
  gender: string;
  location: string;
  forWhom: 'self' | 'other';
  otherPerson?: string;
  consultationType: string;
  specialty: string;
  timeframe: string;
  description?: string;
  amount: number;
  paymentMethod: 'bank-transfer' | 'paystack';
  transactionRef?: string;
}
