import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

// Data access layer — all DB calls live here, never in service or controller
@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>,
  ) {}

  findAll(): Promise<UserEntity[]> {
    return this.repo.find();
  }

  findById(id: string): Promise<UserEntity | null> {
    return this.repo.findOneBy({ id });
  }

  findByEmail(email: string): Promise<UserEntity | null> {
    return this.repo.findOneBy({ email });
  }

  create(dto: CreateUserDto): Promise<UserEntity> {
    const user = this.repo.create(dto);
    return this.repo.save(user);
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserEntity | null> {
    await this.repo.update(id, dto);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
