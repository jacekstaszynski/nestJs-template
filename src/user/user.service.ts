import { Injectable, NotFoundException } from '@nestjs/common';

import type { CreateUserRequest } from './types/create-user.request';
import type { UpdateUserRequest } from './types/update-user.request';
import type { UserFilters } from './types/user.filters';
import type { UserResponse } from './types/user.response';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(data: CreateUserRequest): Promise<UserResponse> {
    return this.userRepository.create(data);
  }

  async getUserById(id: string): Promise<UserResponse> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getUsers(filters?: UserFilters): Promise<UserResponse[]> {
    return this.userRepository.findAll(filters);
  }

  async updateUser(data: UpdateUserRequest): Promise<UserResponse> {
    try {
      return await this.userRepository.update(data);
    } catch (error) {
      if (error.message === 'User not found') {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      await this.userRepository.delete(id);
    } catch (error) {
      if (error.message === 'User not found') {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}
