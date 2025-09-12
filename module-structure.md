# Estructura Típica de un Módulo en Clean Architecture

En este proyecto, cada módulo sigue el patrón de Clean Architecture con las siguientes capas: **application**, **domain** e **infrastructure**. A continuación, se detalla qué tipos de archivos suelen ir en cada carpeta, basándonos en el ejemplo del módulo 'example' y adaptado para los nuevos módulos como Identity, Patients, etc.

Esto sirve como guía para implementar la lógica específica de cada módulo. Los archivos son placeholders y se crearán según las necesidades.

## Raíz del Módulo (ej. src/identity/)
- **module.ts**: Define el módulo NestJS, importa dependencias (como PrismaModule), controllers, providers y exports.

## Carpeta: application/
Esta capa contiene la lógica de aplicación, como servicios, DTOs y excepciones.
- **dto/**: Archivos de Data Transfer Objects (ej. createUser.dto.ts, userResponse.dto.ts) para validar y estructurar datos de entrada/salida.
- **services/**: Servicios que implementan la lógica de negocio (ej. user.service.ts), usando repositorios del domain.
- **exceptions/**: Excepciones personalizadas (ej. userAlreadyExists.exception.ts) para manejar errores específicos.

## Carpeta: domain/
Esta capa define el núcleo del dominio, independiente de frameworks.
- **entities/** o interfaces: Definiciones de entidades o interfaces (ej. user.interface.ts) que describen la estructura de datos.
- **repositories/**: Interfaces abstractas para repositorios (ej. user.repository.ts) que definen métodos como create, find, etc.
- **validators/**: Validadores de dominio (ej. email.validator.ts) para reglas de negocio puras.

## Carpeta: infrastructure/
Esta capa maneja detalles de implementación externa, como controllers y repositorios concretos.
- **controllers/**: Controllers de NestJS (ej. user.controller.ts) que exponen endpoints API y llaman a servicios.
- **repositories/**: Implementaciones concretas de repositorios (ej. user.repository.impl.ts) usando Prisma u otras herramientas para interactuar con la DB.

### Notas Generales:
- **Dependencias**: Cada módulo importa PrismaModule para acceso a la base de datos.
- **Inyección de Dependencias**: En el module.ts, configura providers para inyectar implementaciones (ej. { provide: UserRepository, useClass: UserRepositoryImpl }).
- **Ejemplo de Uso**: Mira el módulo 'example' para un caso práctico.
- Añade subcarpetas y archivos según sea necesario para cada módulo específico (ej. en Identity: roles, users; en Patients: patient.service.ts, etc.).

Esta estructura promueve la separación de preocupaciones, facilitando el mantenimiento y las pruebas.