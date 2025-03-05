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
  async createUser(@Body() data: CreateUserRequest) {
    this.userService.create(data);
    return 'null' as any;
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    this.userService.getUserById(id);
    return 'null' as any;
  }

  @Get()
  async getUsers(@Query() filters: UserFilters) {
    this.userService.getUsers(filters);
    return 'null' as any;
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() data: Omit<UpdateUserRequest, 'id'>,
  ): Promise<UserResponse> {
    this.userService.updateUser({ id, ...data });

    return 'null' as any;
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<void> {
    await this.userService.deleteUser(id);
  }
}
