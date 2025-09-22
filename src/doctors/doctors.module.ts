import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { DoctorController } from './infrastructure/controllers/doctor.controller';
import { DoctorService } from './application/services/doctor.service';
import { DoctorRepository } from './domain/repositories/doctor.interface';
import DoctorRepositoryImpl from './infrastructure/repositories/doctor.repository';
import { IdentityModule } from 'src/identity/identity.module';
import { RegisterDoctorService } from './application/services/register-doctor.service';

@Module({
  imports: [PrismaModule, IdentityModule],
  controllers: [DoctorController],
  providers: [
    DoctorService,
    RegisterDoctorService,
    { provide: DoctorRepository, useClass: DoctorRepositoryImpl}
  ],
  exports: [DoctorService,RegisterDoctorService],
})
export class DoctorsModule {}