# 🚀 Guía de Desarrollo de APIs - Sistema Dental

## 📋 Índice

1. [Arquitectura del Proyecto](#arquitectura-del-proyecto)
2. [Estructura de Carpetas](#estructura-de-carpetas)
3. [Entidades y DTOs](#entidades-y-dtos)
4. [Repositorios](#repositorios)
5. [Servicios](#servicios)
6. [Controladores](#controladores)
7. [Mappers](#mappers)
8. [Validaciones](#validaciones)
9. [APIs a Implementar](#apis-a-implementar)
10. [Comandos de Generación](#comandos-de-generación)

---

## 🏗️ Arquitectura del Proyecto

### **Patrón de Arquitectura: Clean Architecture + NestJS**

```
┌─────────────────────────────────────────────────────────┐
│                    CONTROLLERS                          │
│  (HTTP Layer - Endpoints, Validation, Response)        │
├─────────────────────────────────────────────────────────┤
│                     SERVICES                            │
│  (Business Logic, Use Cases, Orchestration)            │
├─────────────────────────────────────────────────────────┤
│                   REPOSITORIES                          │
│  (Data Access Layer, Prisma Queries)                   │
├─────────────────────────────────────────────────────────┤
│                     DATABASE                            │
│  (MySQL + Prisma ORM)                                  │
└─────────────────────────────────────────────────────────┘
```

### **Flujo de Datos:**

```
Request → Controller → DTO → Service → Repository → Prisma → Database
Response ← Mapper ← Entity ← Service ← Repository ← Prisma ← Database
```

---

## 📁 Estructura de Carpetas

```
src/
├── dentalrecords/
│   ├── application/
│   │   ├── dto/
│   │   │   ├── create-diente.dto.ts
│   │   │   ├── update-diente.dto.ts
│   │   │   ├── create-hallazgo.dto.ts
│   │   │   └── odontograma-response.dto.ts
│   │   ├── mappers/
│   │   │   ├── diente.mapper.ts
│   │   │   ├── superficie.mapper.ts
│   │   │   └── hallazgo.mapper.ts
│   │   └── services/
│   │       ├── diente.service.ts
│   │       ├── superficie.service.ts
│   │       ├── hallazgo.service.ts
│   │       └── odontograma.service.ts
│   ├── domain/
│   │   ├── entities/
│   │   │   ├── diente.entity.ts
│   │   │   ├── superficie-dental.entity.ts
│   │   │   ├── hallazgo.entity.ts
│   │   │   └── odontograma.entity.ts
│   │   └── repositories/
│   │       ├── diente.repository.ts
│   │       ├── superficie.repository.ts
│   │       └── hallazgo.repository.ts
│   ├── infrastructure/
│   │   ├── repositories/
│   │   │   ├── prisma-diente.repository.ts
│   │   │   ├── prisma-superficie.repository.ts
│   │   │   └── prisma-hallazgo.repository.ts
│   │   └── seed/
│   │       └── dental-seed.ts
│   └── presentation/
│       └── controllers/
│           ├── diente.controller.ts
│           ├── superficie.controller.ts
│           ├── hallazgo.controller.ts
│           └── odontograma.controller.ts
├── pacientes/
│   ├── application/
│   ├── domain/
│   ├── infrastructure/
│   └── presentation/
└── common/
    ├── decorators/
    ├── filters/
    ├── guards/
    ├── interceptors/
    └── pipes/
```

---

## 🏷️ Entidades y DTOs

### **1. Entidades de Dominio**

#### **Diente Entity**

```typescript
// src/dentalrecords/domain/entities/diente.entity.ts
export class DienteEntity {
  id: number;
  numeroDiente: string;
  nombreDiente: string;
  descripcion?: string;
  edadDiente?: string;
  tipoDiente: TipoDiente;
  fechaCreacion: Date;
  fechaActualizacion: Date;

  // Relaciones
  configuraciones?: ConfiguracionDienteEntity[];
  hallazgos?: HallazgoPacienteEntity[];
}

export enum TipoDiente {
  INCISIVO = 'INCISIVO',
  CANINO = 'CANINO',
  PREMOLAR = 'PREMOLAR',
  MOLAR = 'MOLAR',
}
```

#### **Superficie Dental Entity**

```typescript
// src/dentalrecords/domain/entities/superficie-dental.entity.ts
export class SuperficieDentalEntity {
  id: number;
  configuracionSuperficieId: number;
  fila: number;
  columna: number;
  codigo: string;
  caraAnatomica: CaraAnatomica;
  ubicacionEspecifica?: string;
  esActiva: boolean;
  descripcion: string;
  fechaCreacion: Date;
  fechaActualizacion: Date;

  // Relaciones
  configuracionSuperficie?: ConfiguracionSuperficieEntity;
  hallazgos?: HallazgoPacienteEntity[];
}

export enum CaraAnatomica {
  VESTIBULAR = 'VESTIBULAR',
  LINGUAL = 'LINGUAL',
  MESIAL = 'MESIAL',
  DISTAL = 'DISTAL',
  OCLUSAL = 'OCLUSAL',
  PALATINA = 'PALATINA',
}
```

#### **Hallazgo Entity**

```typescript
// src/dentalrecords/domain/entities/hallazgo.entity.ts
export class HallazgoEntity {
  id: number;
  nombreHallazgo: string;
  abreviacion?: string;
  descripcion?: string;
  tipoHallazgo: TipoHallazgo;
  color?: string;
  fechaCreacion: Date;
  fechaActualizacion: Date;

  // Relaciones
  hallazgosPaciente?: HallazgoPacienteEntity[];
}

export enum TipoHallazgo {
  DIENTE = 'diente',
  CARA = 'cara',
}
```

### **2. DTOs de Aplicación**

#### **Create Diente DTO**

```typescript
// src/dentalrecords/application/dto/create-diente.dto.ts
import { IsString, IsEnum, IsOptional, IsNotEmpty } from 'class-validator';
import { TipoDiente } from '../entities/diente.entity';

export class CreateDienteDto {
  @IsString()
  @IsNotEmpty()
  numeroDiente: string;

  @IsString()
  @IsNotEmpty()
  nombreDiente: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsString()
  @IsOptional()
  edadDiente?: string;

  @IsEnum(TipoDiente)
  tipoDiente: TipoDiente;
}
```

#### **Odontograma Response DTO**

```typescript
// src/dentalrecords/application/dto/odontograma-response.dto.ts
export class OdontogramaResponseDto {
  pacienteId: number;
  dientes: DienteOdontogramaDto[];
  fechaUltimaActualizacion: Date;
}

export class DienteOdontogramaDto {
  id: number;
  numeroDiente: string;
  nombreDiente: string;
  tipoDiente: string;
  superficies: SuperficieOdontogramaDto[];
  hallazgos: HallazgoOdontogramaDto[];
}

export class SuperficieOdontogramaDto {
  id: number;
  fila: number;
  columna: number;
  codigo: string;
  caraAnatomica: string;
  esActiva: boolean;
  hallazgo?: HallazgoOdontogramaDto;
}

export class HallazgoOdontogramaDto {
  id: number;
  nombreHallazgo: string;
  abreviacion: string;
  color: string;
  tipoHallazgo: string;
  observaciones?: string;
  fechaRegistro: Date;
}
```

---

## 🗄️ Repositorios

### **1. Repository Interface (Domain)**

```typescript
// src/dentalrecords/domain/repositories/diente.repository.ts
import { DienteEntity } from '../entities/diente.entity';

export interface DienteRepository {
  findAll(): Promise<DienteEntity[]>;
  findById(id: number): Promise<DienteEntity | null>;
  findByNumero(numero: string): Promise<DienteEntity | null>;
  findByTipo(tipo: string): Promise<DienteEntity[]>;
  create(diente: Partial<DienteEntity>): Promise<DienteEntity>;
  update(id: number, diente: Partial<DienteEntity>): Promise<DienteEntity>;
  delete(id: number): Promise<void>;
  findWithSuperficies(id: number): Promise<DienteEntity | null>;
  findWithHallazgos(
    id: number,
    pacienteId: number,
  ): Promise<DienteEntity | null>;
}
```

### **2. Repository Implementation (Infrastructure)**

```typescript
// src/dentalrecords/infrastructure/repositories/prisma-diente.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DienteRepository } from '../../domain/repositories/diente.repository';
import { DienteEntity } from '../../domain/entities/diente.entity';
import { DienteMapper } from '../../application/mappers/diente.mapper';

@Injectable()
export class PrismaDienteRepository implements DienteRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: DienteMapper,
  ) {}

  async findAll(): Promise<DienteEntity[]> {
    const dientes = await this.prisma.diente.findMany({
      orderBy: { numero_diente: 'asc' },
    });
    return dientes.map(this.mapper.toDomain);
  }

  async findById(id: number): Promise<DienteEntity | null> {
    const diente = await this.prisma.diente.findUnique({
      where: { id },
    });
    return diente ? this.mapper.toDomain(diente) : null;
  }

  async findWithSuperficies(id: number): Promise<DienteEntity | null> {
    const diente = await this.prisma.diente.findUnique({
      where: { id },
      include: {
        ConfiguracionDiente: {
          include: {
            configuracion_superficie: {
              include: {
                SuperficieDental: true,
              },
            },
          },
        },
      },
    });
    return diente ? this.mapper.toDomainWithSuperficies(diente) : null;
  }

  async create(diente: Partial<DienteEntity>): Promise<DienteEntity> {
    const created = await this.prisma.diente.create({
      data: this.mapper.toPrisma(diente),
    });
    return this.mapper.toDomain(created);
  }

  // ... más métodos
}
```

---

## 🔧 Servicios

### **Diente Service**

```typescript
// src/dentalrecords/application/services/diente.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { DienteRepository } from '../../domain/repositories/diente.repository';
import { CreateDienteDto } from '../dto/create-diente.dto';
import { UpdateDienteDto } from '../dto/update-diente.dto';
import { DienteEntity } from '../../domain/entities/diente.entity';

@Injectable()
export class DienteService {
  constructor(private readonly dienteRepository: DienteRepository) {}

  async findAll(): Promise<DienteEntity[]> {
    return this.dienteRepository.findAll();
  }

  async findById(id: number): Promise<DienteEntity> {
    const diente = await this.dienteRepository.findById(id);
    if (!diente) {
      throw new NotFoundException(`Diente con ID ${id} no encontrado`);
    }
    return diente;
  }

  async findByNumero(numero: string): Promise<DienteEntity> {
    const diente = await this.dienteRepository.findByNumero(numero);
    if (!diente) {
      throw new NotFoundException(`Diente ${numero} no encontrado`);
    }
    return diente;
  }

  async create(createDienteDto: CreateDienteDto): Promise<DienteEntity> {
    // Validar que no exista el número de diente
    const existingDiente = await this.dienteRepository.findByNumero(
      createDienteDto.numeroDiente,
    );
    if (existingDiente) {
      throw new ConflictException(
        `Ya existe un diente con el número ${createDienteDto.numeroDiente}`,
      );
    }

    return this.dienteRepository.create(createDienteDto);
  }

  async update(
    id: number,
    updateDienteDto: UpdateDienteDto,
  ): Promise<DienteEntity> {
    await this.findById(id); // Verificar que existe
    return this.dienteRepository.update(id, updateDienteDto);
  }

  async delete(id: number): Promise<void> {
    await this.findById(id); // Verificar que existe
    return this.dienteRepository.delete(id);
  }

  async getDienteWithSuperficies(id: number): Promise<DienteEntity> {
    const diente = await this.dienteRepository.findWithSuperficies(id);
    if (!diente) {
      throw new NotFoundException(`Diente con ID ${id} no encontrado`);
    }
    return diente;
  }
}
```

### **Odontograma Service**

```typescript
// src/dentalrecords/application/services/odontograma.service.ts
import { Injectable } from '@nestjs/common';
import { DienteRepository } from '../../domain/repositories/diente.repository';
import { HallazgoRepository } from '../../domain/repositories/hallazgo.repository';
import { OdontogramaResponseDto } from '../dto/odontograma-response.dto';
import { CreateHallazgoPacienteDto } from '../dto/create-hallazgo-paciente.dto';

@Injectable()
export class OdontogramaService {
  constructor(
    private readonly dienteRepository: DienteRepository,
    private readonly hallazgoRepository: HallazgoRepository,
  ) {}

  async getOdontogramaPaciente(
    pacienteId: number,
  ): Promise<OdontogramaResponseDto> {
    // Obtener todos los dientes con sus configuraciones y superficies
    const dientes = await this.dienteRepository.findAll();

    // Obtener hallazgos del paciente
    const hallazgosPaciente =
      await this.hallazgoRepository.findByPaciente(pacienteId);

    // Mapear y combinar la información
    const dientesOdontograma = await Promise.all(
      dientes.map(async (diente) => {
        const superficies = await this.getSuperficiesDiente(diente.id);
        const hallazgosDiente = hallazgosPaciente.filter(
          (h) => h.dienteId === diente.id,
        );

        return {
          id: diente.id,
          numeroDiente: diente.numeroDiente,
          nombreDiente: diente.nombreDiente,
          tipoDiente: diente.tipoDiente,
          superficies: superficies.map((s) => ({
            ...s,
            hallazgo: hallazgosDiente.find((h) => h.superficieId === s.id),
          })),
          hallazgos: hallazgosDiente.filter((h) => !h.superficieId), // Hallazgos de diente completo
        };
      }),
    );

    return {
      pacienteId,
      dientes: dientesOdontograma,
      fechaUltimaActualizacion: new Date(),
    };
  }

  async registrarHallazgo(
    createHallazgoDto: CreateHallazgoPacienteDto,
  ): Promise<void> {
    // Validar que el diente existe
    await this.dienteRepository.findById(createHallazgoDto.dienteId);

    // Si es hallazgo por superficie, validar que la superficie existe
    if (createHallazgoDto.superficieId) {
      // Validar superficie...
    }

    // Crear el hallazgo
    return this.hallazgoRepository.createHallazgoPaciente(createHallazgoDto);
  }

  private async getSuperficiesDiente(dienteId: number) {
    // Implementar lógica para obtener superficies del diente
  }
}
```

---

## 🎮 Controladores

### **Diente Controller**

```typescript
// src/dentalrecords/presentation/controllers/diente.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DienteService } from '../../application/services/diente.service';
import { CreateDienteDto } from '../../application/dto/create-diente.dto';
import { UpdateDienteDto } from '../../application/dto/update-diente.dto';

@ApiTags('Dientes')
@Controller('api/dientes')
export class DienteController {
  constructor(private readonly dienteService: DienteService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo diente' })
  @ApiResponse({ status: 201, description: 'Diente creado exitosamente' })
  @ApiResponse({ status: 409, description: 'El número de diente ya existe' })
  async create(@Body() createDienteDto: CreateDienteDto) {
    return this.dienteService.create(createDienteDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los dientes' })
  @ApiResponse({
    status: 200,
    description: 'Lista de dientes obtenida exitosamente',
  })
  async findAll() {
    return this.dienteService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un diente por ID' })
  @ApiResponse({ status: 200, description: 'Diente encontrado' })
  @ApiResponse({ status: 404, description: 'Diente no encontrado' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.dienteService.findById(id);
  }

  @Get(':id/superficies')
  @ApiOperation({ summary: 'Obtener diente con sus superficies' })
  async getDienteWithSuperficies(@Param('id', ParseIntPipe) id: number) {
    return this.dienteService.getDienteWithSuperficies(id);
  }

  @Get('numero/:numero')
  @ApiOperation({ summary: 'Obtener diente por número FDI' })
  async findByNumero(@Param('numero') numero: string) {
    return this.dienteService.findByNumero(numero);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un diente' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDienteDto: UpdateDienteDto,
  ) {
    return this.dienteService.update(id, updateDienteDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un diente' })
  @ApiResponse({ status: 204, description: 'Diente eliminado exitosamente' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.dienteService.delete(id);
    return { message: 'Diente eliminado exitosamente' };
  }
}
```

### **Odontograma Controller**

```typescript
// src/dentalrecords/presentation/controllers/odontograma.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { OdontogramaService } from '../../application/services/odontograma.service';
import { CreateHallazgoPacienteDto } from '../../application/dto/create-hallazgo-paciente.dto';

@ApiTags('Odontograma')
@Controller('api/odontograma')
export class OdontogramaController {
  constructor(private readonly odontogramaService: OdontogramaService) {}

  @Get('paciente/:pacienteId')
  @ApiOperation({ summary: 'Obtener odontograma completo de un paciente' })
  async getOdontogramaPaciente(
    @Param('pacienteId', ParseIntPipe) pacienteId: number,
  ) {
    return this.odontogramaService.getOdontogramaPaciente(pacienteId);
  }

  @Post('hallazgo')
  @ApiOperation({ summary: 'Registrar nuevo hallazgo en odontograma' })
  async registrarHallazgo(
    @Body() createHallazgoDto: CreateHallazgoPacienteDto,
  ) {
    return this.odontogramaService.registrarHallazgo(createHallazgoDto);
  }
}
```

---

## 🔄 Mappers

### **Diente Mapper**

```typescript
// src/dentalrecords/application/mappers/diente.mapper.ts
import { Injectable } from '@nestjs/common';
import { DienteEntity, TipoDiente } from '../../domain/entities/diente.entity';

@Injectable()
export class DienteMapper {
  toDomain(prismaData: any): DienteEntity {
    return {
      id: prismaData.id,
      numeroDiente: prismaData.numero_diente,
      nombreDiente: prismaData.nombre_diente,
      descripcion: prismaData.descripcion,
      edadDiente: prismaData.edad_diente,
      tipoDiente: prismaData.tipo_diente as TipoDiente,
      fechaCreacion: prismaData.fecha_creacion,
      fechaActualizacion: prismaData.fecha_actualizacion,
    };
  }

  toPrisma(entity: Partial<DienteEntity>): any {
    return {
      numero_diente: entity.numeroDiente,
      nombre_diente: entity.nombreDiente,
      descripcion: entity.descripcion,
      edad_diente: entity.edadDiente,
      tipo_diente: entity.tipoDiente,
    };
  }

  toDomainWithSuperficies(prismaData: any): DienteEntity {
    const diente = this.toDomain(prismaData);

    if (prismaData.ConfiguracionDiente) {
      diente.configuraciones = prismaData.ConfiguracionDiente.map((config) => ({
        // Mapear configuraciones y superficies
      }));
    }

    return diente;
  }
}
```

---

## ✅ Validaciones

### **Custom Validators**

```typescript
// src/common/validators/numero-diente.validator.ts
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsValidNumeroDiente(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidNumeroDiente',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          // Validar formato FDI (11-18, 21-28, 31-38, 41-48)
          const fdPattern = /^[1-4][1-8]$/;
          return typeof value === 'string' && fdPattern.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return 'El número de diente debe seguir el formato FDI (ej: 11, 16, 31, 48)';
        },
      },
    });
  };
}
```

---

## 🚀 APIs a Implementar

### **1. Dientes**

- `GET /api/dientes` - Listar todos los dientes
- `GET /api/dientes/:id` - Obtener diente por ID
- `GET /api/dientes/numero/:numero` - Obtener diente por número FDI
- `GET /api/dientes/:id/superficies` - Obtener diente con superficies
- `POST /api/dientes` - Crear nuevo diente
- `PATCH /api/dientes/:id` - Actualizar diente
- `DELETE /api/dientes/:id` - Eliminar diente

### **2. Superficies**

- `GET /api/superficies/configuracion/:tipo` - Obtener configuración por tipo de diente
- `GET /api/superficies/diente/:dienteId` - Obtener superficies de un diente

### **3. Hallazgos**

- `GET /api/hallazgos` - Listar todos los hallazgos disponibles
- `GET /api/hallazgos/tipo/:tipo` - Obtener hallazgos por tipo (diente/cara)
- `POST /api/hallazgos` - Crear nuevo tipo de hallazgo

### **4. Odontograma**

- `GET /api/odontograma/paciente/:id` - Obtener odontograma completo
- `POST /api/odontograma/hallazgo` - Registrar hallazgo en superficie
- `PUT /api/odontograma/hallazgo/:id` - Actualizar hallazgo
- `DELETE /api/odontograma/hallazgo/:id` - Eliminar hallazgo

### **5. Pacientes (Básico)**

- `GET /api/pacientes` - Listar pacientes
- `GET /api/pacientes/:id` - Obtener paciente por ID
- `POST /api/pacientes` - Crear paciente

---

## ⚡ Comandos de Generación

### **Generar Módulo Completo**

```bash
# Generar módulo de dientes
nest g module dentalrecords/dientes
nest g controller dentalrecords/dientes
nest g service dentalrecords/dientes

# Generar módulo de odontograma
nest g module dentalrecords/odontograma
nest g controller dentalrecords/odontograma
nest g service dentalrecords/odontograma

# Generar módulo de pacientes
nest g module pacientes
nest g controller pacientes
nest g service pacientes
```

### **Estructura de Archivos a Crear**

```bash
# 1. Crear entidades
touch src/dentalrecords/domain/entities/diente.entity.ts
touch src/dentalrecords/domain/entities/superficie-dental.entity.ts
touch src/dentalrecords/domain/entities/hallazgo.entity.ts

# 2. Crear DTOs
touch src/dentalrecords/application/dto/create-diente.dto.ts
touch src/dentalrecords/application/dto/update-diente.dto.ts
touch src/dentalrecords/application/dto/odontograma-response.dto.ts

# 3. Crear repositorios
touch src/dentalrecords/domain/repositories/diente.repository.ts
touch src/dentalrecords/infrastructure/repositories/prisma-diente.repository.ts

# 4. Crear mappers
touch src/dentalrecords/application/mappers/diente.mapper.ts

# 5. Crear servicios
touch src/dentalrecords/application/services/diente.service.ts
touch src/dentalrecords/application/services/odontograma.service.ts
```

---

## 🎯 Orden de Implementación Recomendado

### **Fase 1: Fundación**

1. ✅ Crear entidades de dominio
2. ✅ Crear DTOs básicos
3. ✅ Crear interfaces de repositorios
4. ✅ Crear mappers

### **Fase 2: Infraestructura**

1. ✅ Implementar repositorios con Prisma
2. ✅ Crear servicios básicos
3. ✅ Crear controladores simples
4. ✅ Configurar validaciones

### **Fase 3: Funcionalidades Core**

1. ✅ API de dientes (CRUD básico)
2. ✅ API de superficies (consulta)
3. ✅ API de hallazgos (CRUD)
4. ✅ API de odontograma (consulta)

### **Fase 4: Funcionalidades Avanzadas**

1. ✅ Registro de hallazgos por superficie
2. ✅ Historial de cambios
3. ✅ Reportes y estadísticas
4. ✅ Validaciones complejas

---

## 🔧 Configuración Adicional

### **Module Configuration**

```typescript
// src/dentalrecords/dentalrecords.module.ts
import { Module } from '@nestjs/common';
import { DienteController } from './presentation/controllers/diente.controller';
import { DienteService } from './application/services/diente.service';
import { PrismaDienteRepository } from './infrastructure/repositories/prisma-diente.repository';
import { DienteMapper } from './application/mappers/diente.mapper';

@Module({
  controllers: [DienteController],
  providers: [
    DienteService,
    DienteMapper,
    {
      provide: 'DienteRepository',
      useClass: PrismaDienteRepository,
    },
  ],
  exports: [DienteService],
})
export class DentalRecordsModule {}
```
