import { Test, TestingModule } from '@nestjs/testing';
import { ConfigurationModule } from '../config/config/configuration.module';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

describe('UserService', () => {
  let userService: UserService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigurationModule],
      providers: [UserService, UserRepository],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user', () => {
      expect(true).toBe(true);
    });
  });
});
