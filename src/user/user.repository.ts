import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async create() {
    return null;
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findAll(filters?: Prisma.UserWhereInput) {
    return this.prisma.user.findMany({
      where: filters,
    });
  }

  async update(data: Prisma.UserUpdateInput & { id: string }) {
    const { id, ...updateData } = data;
    return this.prisma.user.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: string) {
    await this.prisma.user.delete({
      where: { id },
    });
  }
}
