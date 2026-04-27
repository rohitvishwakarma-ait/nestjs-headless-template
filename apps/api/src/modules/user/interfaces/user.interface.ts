import { UserRole } from '../enums/user-role.enum';

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}
