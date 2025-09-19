import { Global, Module } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [
    PrismaService,
    {
      provide: PrismaClient,
      useExisting: PrismaService,
    },
  ],
  exports: [PrismaService, PrismaClient],
})
export class PrismaModule {}
