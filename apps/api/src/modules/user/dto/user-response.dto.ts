import { UserRole } from '../enums/user-role.enum';

// Handbook rule: type cast response — always return typed DTOs
export class UserResponseDto {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}
