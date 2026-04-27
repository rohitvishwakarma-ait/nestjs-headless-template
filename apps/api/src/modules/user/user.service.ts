import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UserEntity } from './entities/user.entity';
import { USER_NOT_FOUND } from './constants/user.constants';
import { AppLogger } from '../../../../../libs/utils/src/logger.util';

@Injectable()
export class UserService {
  private readonly logger = new AppLogger(UserService.name);

  constructor(private readonly userRepository: UserRepository) {}

  async findAll(): Promise<UserResponseDto[]> {
    this.logger.log('Fetching all users');
    const users = await this.userRepository.findAll();
    return users.map((u) => this.toResponseDto(u));
  }

  async findOne(id: string): Promise<UserResponseDto> {
    this.logger.log(`Fetching user id=${id}`);
    const user = await this.userRepository.findById(id);
    if (!user) {
      this.logger.warn(`User not found id=${id}`);
      throw new NotFoundException(USER_NOT_FOUND);
    }
    return this.toResponseDto(user);
  }

  async create(dto: CreateUserDto): Promise<UserResponseDto> {
    this.logger.log(`Creating user email=${dto.email}`);
    const user = await this.userRepository.create(dto);
    this.logger.log(`User created id=${user.id}`);
    return this.toResponseDto(user);
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserResponseDto> {
    this.logger.log(`Updating user id=${id}`);
    const user = await this.userRepository.update(id, dto);
    if (!user) {
      this.logger.warn(`User not found for update id=${id}`);
      throw new NotFoundException(USER_NOT_FOUND);
    }
    return this.toResponseDto(user);
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Deleting user id=${id}`);
    await this.userRepository.delete(id);
  }

  private toResponseDto(user: UserEntity): UserResponseDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  }
}
