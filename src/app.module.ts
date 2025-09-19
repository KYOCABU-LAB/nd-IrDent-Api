import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExampleModule } from './example/example.module';
import { PrismaModule } from './shared/prisma/prisma.module';
import { AllExceptionsFilter } from './shared/filters/http-exception.filter';
import { DoctorsModule } from './doctors/doctors.module';
import { IdentityModule } from './identity/identity.module';
import { RegistrosDentalesModule } from './dentalrecords/registrosdentales.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000, // 1 segundo
        limit: 10, // 10 requests por segundo - esto es global
      },
      {
        name: 'medium',
        ttl: 10000, // 10 segundos
        limit: 100, // 100 requests por 10 segundos
      },
      {
        name: 'long',
        ttl: 60000, // 1 minuto
        limit: 1000, // 1000 requests por minuto
      },
    ]),
    ExampleModule,
    DoctorsModule,
    PrismaModule,
    IdentityModule,
    RegistrosDentalesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
