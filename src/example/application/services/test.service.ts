import { TestRepository } from 'src/example/domain/repositories/test.interface';
import type { CreateTestDto, TestResponseDto } from '../dto/test';
import { TestValidator } from 'src/example/domain/validators/test.validator';
import {
  EmailAlreadyExistsException,
  EmailException,
} from '../exceptions/EmailExeption';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TestService {
  constructor(private readonly testRepository: TestRepository) {}

  async createTest(data: CreateTestDto): Promise<TestResponseDto> {
    if (!TestValidator.validateMessage(data.email)) {
      throw new EmailException('El email no es valido');
    }
    const exists = await this.testRepository.existsByEmail(data.email);
    if (exists) {
      throw new EmailAlreadyExistsException();
    }
    return this.testRepository.createTest(data);
  }
}
