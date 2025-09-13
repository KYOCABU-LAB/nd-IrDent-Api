import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { DoctorController } from './infrastructure/controllers/doctor.controller';
import { DoctorService } from './application/services/doctor.service';
import DoctorRepositoryImpl from './infrastructure/repositories/doctor.repository';
import { DoctorRepository } from './domain/repositories/doctor.interface';

@Module({
  imports: [PrismaModule],
  controllers: [DoctorController],
  providers: [
    DoctorService,
    { provide: DoctorRepository, useClass: DoctorRepositoryImpl}
  ],
  exports: [DoctorService],
})
export class DoctorsModule {}