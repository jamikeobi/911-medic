import { User } from "./User";

export interface AuthResponse {
  status: string;
  message: string;
  token: string;
  data: {
    user: User;
    role: string;
  };
}
