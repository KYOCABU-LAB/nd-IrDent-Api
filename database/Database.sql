CREATE TABLE Documento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo_documento VARCHAR(100) NOT NULL,
    numero_documento VARCHAR(50) NOT NULL UNIQUE
)

-- datos de pacientes
CREATE TABLE Paciente (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_documento INT,
    nombre VARCHAR(100) NOT NULL,
    apellido_paterno VARCHAR(100),
    apellido_materno VARCHAR(100),
    fecha_nacimiento DATE,
    genero ENUM(
        'Feminino',
        'Masculino',
        'Otro'
    ),
    telefono VARCHAR(15),
    email VARCHAR(100),
    direccion TEXT,
    estado_civil ENUM(
        'soltero',
        'casado',
        'divorciado',
        'viudo'
    ),
    edad INT,
    ocupacion VARCHAR(100),
    fecha_nacimiento DATE,
    estado ENUM('activo', 'inactivo') DEFAULT 'activo',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_documento) REFERENCES Documento (id)
)

CREATE TABLE Contacto_Paciente (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_paciente BIGINT,
    telf_casa VARCHAR(15),
    telf_oficina VARCHAR(15),
    telf_celular VARCHAR(15),
    email VARCHAR(100),
    FOREIGN KEY (id_paciente) REFERENCES Paciente (id)
)

CREATE TABLE Direccion_Paciente (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_paciente BIGINT,
    calle VARCHAR(100),
    referencia VARCHAR(100),
    departamento VARCHAR(100),
    distrito VARCHAR(100),
    provincia VARCHAR(40),
    pais VARCHAR(100),
    nro_exterior VARCHAR(40) NULL,
    FOREIGN KEY (id_paciente) REFERENCES Paciente (id)
)

--datos de doctores
CREATE TABLE Doctor (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido_paterno VARCHAR(100),
    apellido_materno VARCHAR(100),
    especialidad VARCHAR(100),
    telefono VARCHAR(15),
    email VARCHAR(100),
    estado ENUM('activo', 'inactivo') DEFAULT 'activo',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)

-- datos de hallazgos

CREATE TABLE Hallazgos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_hallazgo VARCHAR(100) NOT NULL,
    abreviacion VARCHAR(20),
    descripcion TEXT,
    tipo_hallazgo ENUM('diente', 'cara'),
    color VARCHAR(20),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)

CREATE TABLE Dientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero_diente VARCHAR(10) NOT NULL UNIQUE,
    nombre_diente VARCHAR(100) NOT NULL,
    descripcion TEXT,
    edad_diente ENUM('adulto', 'niño'),
    tipo_diente ENUM(
        'incisivo',
        'canino',
        'premolar',
        'molar'
    ),
    matriz_diente JSON,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)

CREATE TABLE Hallazgos_paciente (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_diente INT,
    id_paciente BIGINT,
    id_doctor BIGINT,
    id_hallazgo INT,
    descripcion TEXT,
    tipo_hallazgo ENUM('diente', 'cara'),
    nombre_hallazgo VARCHAR(100),
    observaciones TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_diente) REFERENCES Dientes (id),
    FOREIGN KEY (id_paciente) REFERENCES Paciente (id),
    FOREIGN KEY (id_doctor) REFERENCES Doctor (id),
    FOREIGN KEY (id_hallazgo) REFERENCES Hallazgos (id)
),

--modulo tratamiento

CREATE TABLE Plan_Tratamiento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_paciente BIGINT,
    cantidad TEXT,
    fecha_inicio DATE,
    fecha_fin DATE,
    estado ENUM('activo', 'inactivo') DEFAULT 'activo',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_paciente) REFERENCES Paciente (id)
)

CREATE TABLE Tratamiento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_plan_tratamiento INT,
    descripcion TEXT,
    costo DECIMAL(10, 2),
    duracion INT,
    estado ENUM('activo', 'inactivo') DEFAULT 'activo',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_plan_tratamiento) REFERENCES Plan_Tratamiento (id)
)

CREATE TABLE Tipo_Registro_clinico (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_tipo VARCHAR(100) NOT NULL,
    descripcion TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)