import { Controller, Post, Body } from '@nestjs/common';
import { TestService } from 'src/example/application/services/test.service';
import type {
  CreateTestDto,
  TestResponseDto,
} from 'src/example/application/dto/test';

@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Post('/create')
  async createTest(@Body() data: CreateTestDto): Promise<TestResponseDto> {
    return this.testService.createTest(data);
  }
}
