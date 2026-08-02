
export interface ApiError {
  status: string;
  message: string;
  error?: {
    statusCode: number;
    isOperational?: boolean;
  };
}