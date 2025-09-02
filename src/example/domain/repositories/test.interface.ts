import type {
  CreateTestDto,
  TestResponseDto,
} from '../../application/dto/test';

export abstract class TestRepository {
  abstract createTest(data: CreateTestDto): Promise<TestResponseDto>;
  abstract existsByEmail(email: string): Promise<boolean>;
}
