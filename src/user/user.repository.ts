import { Injectable, NotFoundException } from '@nestjs/common';
import type { CreateUserRequest } from './types/create-user.request';
import type { UpdateUserRequest } from './types/update-user.request';
import type { UserFilters } from './types/user.filters';
import type { UserResponse } from './types/user.response';

@Injectable()
export class UserRepository {
  private users: UserResponse[] = [];

  async create(data: CreateUserRequest): Promise<UserResponse> {
    const newUser: UserResponse = {
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.push(newUser);
    return newUser;
  }

  async findById(id: string): Promise<UserResponse | null> {
    return this.users.find(user => user.id === id) || null;
  }

  async findAll(filters?: UserFilters): Promise<UserResponse[]> {
    return this.users.filter(user => {
      if (filters?.firstName && !user.firstName.includes(filters.firstName)) return false;
      if (filters?.email && !user.email.includes(filters.email)) return false;
      return true;
    });
  }

  async update(data: UpdateUserRequest): Promise<UserResponse> {
    const user = this.users.find(user => user.id === data.id);
    if (!user) throw new NotFoundException('User not found');
    user.firstName = data.firstName;
    user.email = data.email;
    user.updatedAt = new Date();
    return user;
  }

  async delete(id: string): Promise<void> {
    const index = this.users.findIndex(user => user.id === id);
    if (index === -1) throw new NotFoundException('User not found');
    this.users.splice(index, 1);
  }
}
