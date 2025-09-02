import { Injectable } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';
import type {
  CreateTestDto,
  TestResponseDto,
} from 'src/example/application/dto/test';
import { TestRepository } from 'src/example/domain/repositories/test.interface';

@Injectable()
class TestRepositoryImpl extends TestRepository {
  constructor(private readonly prisma: PrismaClient) {
    super();
  }

  async createTest(data: CreateTestDto): Promise<TestResponseDto> {
    try {
      return await this.prisma.testUser.create({
        data: {
          email: data.email,
          name: data.name || null,
        },
      });
    } catch (error) {
      throw new Error(`error: ${error.message}`);
    }
  }

  async existsByEmail(email: string): Promise<boolean> {
    const user = await this.prisma.testUser.findUnique({
      where: { email },
    });
    return !!user;
  }
}

export default TestRepositoryImpl;
