import { Global, Module } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';

@Global()
@Module({
  providers: [
    {
      provide: PrismaClient,
      useValue: new PrismaClient(),
    },
  ],
  exports: [PrismaClient],
})
export class PrismaModule {}
