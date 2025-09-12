# Entidades por Módulo

Este documento mapea las entidades del schema Prisma a los módulos correspondientes en la arquitectura del backend, basado en el análisis del archivo `schema.prisma`.

## Identity
**Propósito**: Gestión de usuarios, autenticación y autorización.

**Entidades principales**:
- User
- Role
- UserRole
- Enum: EstadoUser

## Patients
**Propósito**: Gestión de pacientes y sus datos personales.

**Entidades principales**:
- Paciente
- ContactoPaciente
- DireccionPaciente
- Enums: EnumTipoDocumento, EnumGenero, EnumEstadocivil

## Doctors
**Propósito**: Gestión de doctores y especialistas.

**Entidades principales**:
- Doctor
- Enum: EstadoDoctor, EnumTipoDocumento

## DentalRecords
**Propósito**: Gestión de información dental, dientes y hallazgos.

**Entidades principales**:
- Diente
- TipoMatriz
- PosicionMatriz
- MatrizDiente
- Hallazgos
- HallazgosPaciente
- Enums: EnumTipoDiente, EnumCaraAnatomica, TipoHallazgo

## Treatments
**Propósito**: Gestión de planes de tratamiento, tratamientos y pagos.

**Entidades principales**:
- PlanTratamiento
- Tratamiento
- Pago
- Enums: EstadoPlanTratamiento, EstadoTratamiento, MetodoPago, EstadoPago

## MedicalRecords
**Propósito**: Gestión de registros clínicos y tipos de registros.

**Entidades principales**:
- RegistroClinico
- TipoRegistroClinico

## Appointments
**Propósito**: Gestión de citas médicas.

**Entidades principales**:
- Cita
- Enum: EstadoCita

## Shared
**Propósito**: Entidades y enumeraciones compartidas entre módulos.

**Entidades principales**:
- TestUser (modelo de prueba)
- Enums compartidos (si aplica)

---

### Notas:
- Cada módulo debe implementar sus propios repositorios, servicios y controladores para las entidades listadas.
- Las relaciones entre entidades de diferentes módulos deben manejarse a través de IDs y servicios que se comuniquen entre sí.
- Los enums están asignados al módulo donde tienen mayor relevancia, pero pueden ser utilizados por otros módulos según sea necesario.