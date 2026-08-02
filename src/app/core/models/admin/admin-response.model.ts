export interface ApiListResponse<T> {
  status: string;
  results: number;
  data: T[];
}

export interface ApiMessageResponse {
  status: string;
  message: string;
}

export interface ApiDataResponse<T> {
  status: string;
  data: T;
}
