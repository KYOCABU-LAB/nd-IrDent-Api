import { BaseExceptionFilter, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './shared/filters/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /// Configuración de proxy
  app.getHttpAdapter().getInstance().set('trust proxy', true);

  //// Configuración de pipes para validación
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  /// Configuración de CORS
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  /// Configuración de filtros globales
  app.useGlobalFilters(new BaseExceptionFilter(), new AllExceptionsFilter());

  /// Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('IrDent API - Sistema Dental')
    .setDescription(
      'API REST para el sistema de gestión dental IrDent. Incluye odontograma, pacientes, doctores y hallazgos dentales.',
    )
    .setVersion('1.0')
    .addTag('Dientes', 'Gestión de dientes y configuraciones dentales')
    .addTag('Superficies', 'Superficies dentales y configuraciones de matriz')
    .addTag('Hallazgos', 'Tipos de hallazgos y diagnósticos dentales')
    .addTag('Odontograma', 'Sistema completo de odontograma por paciente')
    .addTag('Pacientes', 'Gestión de pacientes')
    .addTag('Doctores', 'Gestión de doctores')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customSiteTitle: 'IrDent API Documentation',
    customfavIcon: '/favicon.ico',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info .title { color: #2c5aa0 }
    `,
  });

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
