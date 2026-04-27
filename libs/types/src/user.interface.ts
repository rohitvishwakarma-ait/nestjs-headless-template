// Shared types used across frontend and backend
export interface IUserPublic {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
}
