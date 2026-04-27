import { Injectable } from '@nestjs/common';
import { IUser } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

// Data access layer — DB calls live here, not in service or controller
@Injectable()
export class UserRepository {
  // Placeholder: replace with actual ORM (TypeORM / Prisma / Drizzle)
  private users: IUser[] = [];

  async findAll(): Promise<IUser[]> {
    return this.users;
  }

  async findById(id: string): Promise<IUser | null> {
    return this.users.find((u) => u.id === id) ?? null;
  }

  async create(dto: CreateUserDto): Promise<IUser> {
    const user: IUser = {
      id: crypto.randomUUID(),
      name: dto.name,
      email: dto.email,
      role: dto.role,
      createdAt: new Date(),
    };
    this.users.push(user);
    return user;
  }

  async update(id: string, dto: UpdateUserDto): Promise<IUser | null> {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) return null;
    this.users[index] = { ...this.users[index], ...dto };
    return this.users[index];
  }

  async delete(id: string): Promise<void> {
    this.users = this.users.filter((u) => u.id !== id);
  }
}
