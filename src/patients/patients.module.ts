import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { PatientService } from './application/services/patient.service';
import { PatientController } from './infrastructure/controllers/patient.controller';
import { PatientRepository } from './domain/repositories/patient.interface';
import PatientRepositoryImpl from './infrastructure/repositories/patient.repository';

@Module({
  imports: [PrismaModule],
  controllers: [PatientController],
  providers: [
    PatientService,
    { provide: PatientRepository, useClass: PatientRepositoryImpl },
  ],
  exports: [PatientService],
  
})
export class PatientsModule {}
