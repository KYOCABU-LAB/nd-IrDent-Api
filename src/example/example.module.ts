import { Module } from '@nestjs/common';
import { TestController } from './infrastructure/controllers/test.controller';
import { TestService } from './application/services/test.service';
import TestRepositoryImpl from './infrastructure/repositories/test.repository';
import { TestRepository } from './domain/repositories/test.interface';
import { PrismaModule } from '../shared/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TestController],
  providers: [
    TestService,
    { provide: TestRepository, useClass: TestRepositoryImpl },
  ],
  exports: [TestService],
})
export class ExampleModule {}
