import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExampleModule } from './example/example.module';
import { PrismaModule } from './shared/prisma/prisma.module';
import { AllExceptionsFilter } from './shared/filters/http-exception.filter';
import { DoctorsModule } from './doctors/doctors.module';
import { IdentityModule } from './identity/identity.module';

@Module({
  imports: [
    ExampleModule,
    DoctorsModule,
    PrismaModule,
    IdentityModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
