import { Injectable } from '@nestjs/common';

import { ConfigurationService } from '../config/config/configuration.service';
import type { CreateUserRequest } from './types/create-user.request';
import { UpdateUserRequest } from './types/update-user.request';
import { UserFilters } from './types/user.filters';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly configurationService: ConfigurationService,
  ) {}

  async create(data: CreateUserRequest) {
    return this.userRepository.create();
  }

  async getUserById(id: string) {
    return await this.userRepository.findById(id);
  }

  async getUsers(filters?: UserFilters) {
    return this.userRepository.findAll(filters);
  }

  async updateUser(data: UpdateUserRequest) {
    return await this.userRepository.update(data);
  }

  async deleteUser(id: string) {
    await this.userRepository.delete(id);
  }
}
