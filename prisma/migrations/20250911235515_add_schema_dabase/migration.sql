-- CreateTable
CREATE TABLE `TestUser` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,

    UNIQUE INDEX `TestUser_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `password_hash` VARCHAR(191) NOT NULL,
    `estado` ENUM('ACTIVO', 'INACTIVO') NOT NULL DEFAULT 'ACTIVO',
    `fecha_creacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fecha_actualizacion` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Role` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NOT NULL,
    `fecha_creacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fecha_actualizacion` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Role_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserRole` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `asignado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `asignado_por` VARCHAR(191) NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `userId` INTEGER NOT NULL,
    `roleId` INTEGER NOT NULL,

    UNIQUE INDEX `UserRole_userId_roleId_key`(`userId`, `roleId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Paciente` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `numero_documento` VARCHAR(191) NOT NULL,
    `tipo_documento` ENUM('DNI', 'CARNETE_EXTRANJERIA', 'OTRO', 'PASAPORTE') NOT NULL DEFAULT 'DNI',
    `nombre` VARCHAR(191) NOT NULL,
    `apellido_paterno` VARCHAR(191) NOT NULL,
    `apellido_materno` VARCHAR(191) NOT NULL,
    `fecha_nacimiento` DATETIME(3) NOT NULL,
    `genero` ENUM('MASCULINO', 'FEMENINO', 'OTRO') NOT NULL DEFAULT 'OTRO',
    `telefono` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `direccion` VARCHAR(191) NOT NULL,
    `estado_civil` ENUM('SOLTERO', 'CASADO', 'DIVORCIADO', 'VIUDO') NOT NULL,
    `ocupacion` VARCHAR(191) NOT NULL,
    `fecha_creacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fecha_actualizacion` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Paciente_numero_documento_key`(`numero_documento`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ContactoPaciente` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pacienteId` INTEGER NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `telefono` VARCHAR(191) NOT NULL,
    `relacion` VARCHAR(191) NOT NULL,
    `fecha_creacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fecha_actualizacion` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DireccionPaciente` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pacienteId` INTEGER NOT NULL,
    `calle` VARCHAR(191) NOT NULL,
    `referencia` VARCHAR(191) NOT NULL,
    `departamento` VARCHAR(191) NOT NULL,
    `distrito` VARCHAR(191) NOT NULL,
    `provincia` VARCHAR(191) NOT NULL,
    `pais` VARCHAR(191) NOT NULL,
    `nro_exterior` VARCHAR(191) NOT NULL,
    `fecha_creacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fecha_actualizacion` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Doctor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `numero_documento` VARCHAR(191) NOT NULL,
    `tipo_documento` ENUM('DNI', 'CARNETE_EXTRANJERIA', 'OTRO', 'PASAPORTE') NOT NULL DEFAULT 'DNI',
    `nombre` VARCHAR(191) NOT NULL,
    `apellido_paterno` VARCHAR(191) NOT NULL,
    `apellido_materno` VARCHAR(191) NOT NULL,
    `telefono` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `especialidad` VARCHAR(191) NOT NULL,
    `estado` ENUM('ACTIVO', 'INACTIVO') NOT NULL DEFAULT 'ACTIVO',
    `fecha_creacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fecha_actualizacion` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Doctor_numero_documento_key`(`numero_documento`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Diente` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `numero_diente` VARCHAR(191) NOT NULL,
    `nombre_diente` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NULL,
    `edad_diente` VARCHAR(191) NULL,
    `tipo_diente` ENUM('INCISIVO', 'CANINO', 'PREMOLAR', 'MOLAR') NOT NULL,
    `fecha_creacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fecha_actualizacion` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TipoMatriz` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tipo_diente` ENUM('INCISIVO', 'CANINO', 'PREMOLAR', 'MOLAR') NOT NULL,
    `filas` INTEGER NOT NULL DEFAULT 3,
    `columnas` INTEGER NOT NULL DEFAULT 3,
    `descripcion` VARCHAR(191) NOT NULL,
    `fecha_creacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fecha_actualizacion` DATETIME(3) NOT NULL,

    UNIQUE INDEX `TipoMatriz_tipo_diente_key`(`tipo_diente`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PosicionMatriz` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tipoMatrizId` INTEGER NOT NULL,
    `fila` INTEGER NOT NULL,
    `columna` INTEGER NOT NULL,
    `codigo` VARCHAR(191) NOT NULL,
    `cara_anatomica` ENUM('VESTIBULAR', 'LINGUAL', 'MESIAL', 'DISTAL', 'OCLUSAL', 'PALATINA') NOT NULL,
    `ubicacion_especifica` VARCHAR(191) NULL,
    `es_activa` BOOLEAN NOT NULL DEFAULT true,
    `descripcion` VARCHAR(191) NOT NULL,
    `fecha_creacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fecha_actualizacion` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MatrizDiente` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dienteId` INTEGER NOT NULL,
    `tipoMatrizId` INTEGER NOT NULL,
    `fecha_creacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fecha_actualizacion` DATETIME(3) NOT NULL,

    UNIQUE INDEX `MatrizDiente_dienteId_tipoMatrizId_key`(`dienteId`, `tipoMatrizId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Hallazgos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_hallazgo` VARCHAR(100) NOT NULL,
    `abreviacion` VARCHAR(20) NULL,
    `descripcion` TEXT NULL,
    `tipo_hallazgo` ENUM('diente', 'cara') NOT NULL,
    `color` VARCHAR(20) NULL,
    `fecha_creacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fecha_actualizacion` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HallazgosPaciente` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_diente` INTEGER NOT NULL,
    `id_posicion_matriz` INTEGER NULL,
    `id_paciente` INTEGER NOT NULL,
    `id_doctor` INTEGER NOT NULL,
    `id_hallazgo` INTEGER NOT NULL,
    `observaciones` TEXT NULL,
    `fecha_creacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fecha_actualizacion` DATETIME(3) NOT NULL,

    INDEX `idx_paciente_diente`(`id_paciente`, `id_diente`),
    INDEX `idx_fecha_creacion`(`fecha_creacion`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PlanTratamiento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_paciente` INTEGER NULL,
    `fecha_inicio` DATE NULL,
    `fecha_fin` DATE NULL,
    `estado` ENUM('activo', 'inactivo') NOT NULL DEFAULT 'activo',
    `fecha_creacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fecha_actualizacion` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tratamiento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_plan_tratamiento` INTEGER NULL,
    `id_doctor` INTEGER NULL,
    `descripcion` TEXT NULL,
    `costo` DECIMAL(10, 2) NULL,
    `duracion` INTEGER NULL,
    `estado` ENUM('activo', 'inactivo') NOT NULL DEFAULT 'activo',
    `fecha_creacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fecha_actualizacion` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pago` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_tratamiento` INTEGER NULL,
    `monto` DECIMAL(10, 2) NOT NULL,
    `metodo_pago` ENUM('efectivo', 'tarjeta', 'transferencia') NULL,
    `fecha_pago` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `estado` ENUM('pendiente', 'pagado') NOT NULL DEFAULT 'pendiente',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TipoRegistroClinico` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_tipo` VARCHAR(100) NOT NULL,
    `descripcion` TEXT NULL,
    `fecha_creacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fecha_actualizacion` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RegistroClinico` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_paciente` INTEGER NULL,
    `id_doctor` INTEGER NULL,
    `id_tipo_registro` INTEGER NULL,
    `descripcion` TEXT NULL,
    `fecha_registro` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cita` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_paciente` INTEGER NULL,
    `id_doctor` INTEGER NULL,
    `fecha` DATETIME(3) NOT NULL,
    `motivo` TEXT NULL,
    `estado` ENUM('pendiente', 'confirmada', 'cancelada', 'realizada') NOT NULL DEFAULT 'pendiente',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserRole` ADD CONSTRAINT `UserRole_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserRole` ADD CONSTRAINT `UserRole_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ContactoPaciente` ADD CONSTRAINT `ContactoPaciente_pacienteId_fkey` FOREIGN KEY (`pacienteId`) REFERENCES `Paciente`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DireccionPaciente` ADD CONSTRAINT `DireccionPaciente_pacienteId_fkey` FOREIGN KEY (`pacienteId`) REFERENCES `Paciente`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PosicionMatriz` ADD CONSTRAINT `PosicionMatriz_tipoMatrizId_fkey` FOREIGN KEY (`tipoMatrizId`) REFERENCES `TipoMatriz`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MatrizDiente` ADD CONSTRAINT `MatrizDiente_dienteId_fkey` FOREIGN KEY (`dienteId`) REFERENCES `Diente`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MatrizDiente` ADD CONSTRAINT `MatrizDiente_tipoMatrizId_fkey` FOREIGN KEY (`tipoMatrizId`) REFERENCES `TipoMatriz`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HallazgosPaciente` ADD CONSTRAINT `HallazgosPaciente_id_diente_fkey` FOREIGN KEY (`id_diente`) REFERENCES `Diente`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HallazgosPaciente` ADD CONSTRAINT `HallazgosPaciente_id_posicion_matriz_fkey` FOREIGN KEY (`id_posicion_matriz`) REFERENCES `PosicionMatriz`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HallazgosPaciente` ADD CONSTRAINT `HallazgosPaciente_id_paciente_fkey` FOREIGN KEY (`id_paciente`) REFERENCES `Paciente`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HallazgosPaciente` ADD CONSTRAINT `HallazgosPaciente_id_doctor_fkey` FOREIGN KEY (`id_doctor`) REFERENCES `Doctor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HallazgosPaciente` ADD CONSTRAINT `HallazgosPaciente_id_hallazgo_fkey` FOREIGN KEY (`id_hallazgo`) REFERENCES `Hallazgos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PlanTratamiento` ADD CONSTRAINT `PlanTratamiento_id_paciente_fkey` FOREIGN KEY (`id_paciente`) REFERENCES `Paciente`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tratamiento` ADD CONSTRAINT `Tratamiento_id_plan_tratamiento_fkey` FOREIGN KEY (`id_plan_tratamiento`) REFERENCES `PlanTratamiento`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tratamiento` ADD CONSTRAINT `Tratamiento_id_doctor_fkey` FOREIGN KEY (`id_doctor`) REFERENCES `Doctor`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pago` ADD CONSTRAINT `Pago_id_tratamiento_fkey` FOREIGN KEY (`id_tratamiento`) REFERENCES `Tratamiento`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RegistroClinico` ADD CONSTRAINT `RegistroClinico_id_paciente_fkey` FOREIGN KEY (`id_paciente`) REFERENCES `Paciente`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RegistroClinico` ADD CONSTRAINT `RegistroClinico_id_doctor_fkey` FOREIGN KEY (`id_doctor`) REFERENCES `Doctor`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RegistroClinico` ADD CONSTRAINT `RegistroClinico_id_tipo_registro_fkey` FOREIGN KEY (`id_tipo_registro`) REFERENCES `TipoRegistroClinico`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cita` ADD CONSTRAINT `Cita_id_paciente_fkey` FOREIGN KEY (`id_paciente`) REFERENCES `Paciente`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cita` ADD CONSTRAINT `Cita_id_doctor_fkey` FOREIGN KEY (`id_doctor`) REFERENCES `Doctor`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
