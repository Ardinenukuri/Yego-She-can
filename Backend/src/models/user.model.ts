export interface User {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password_hash: string;
  gender?: string;
  age?: number;
  is_email_verified: boolean;
  created_at: Date;
  updated_at: Date;
}