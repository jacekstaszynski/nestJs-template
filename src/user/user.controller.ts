import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CreateUserRequest } from './types/create-user.request';
import { UpdateUserRequest } from './types/update-user.request';
import { UserFilters } from './types/user.filters';
import { UserResponse } from './types/user.response';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() data: CreateUserRequest): Promise<UserResponse> {
    return this.userService.createUser(data);
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<UserResponse> {
    return this.userService.getUserById(id);
  }

  @Get()
  async getUsers(@Query() filters: UserFilters): Promise<UserResponse[]> {
    return this.userService.getUsers(filters);
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() data: Omit<UpdateUserRequest, 'id'>,
  ): Promise<UserResponse> {
    return this.userService.updateUser({ id, ...data });
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<void> {
    await this.userService.deleteUser(id);
  }
}
