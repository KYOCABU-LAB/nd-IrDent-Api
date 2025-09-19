-- Active: 1752788997950@@127.0.0.1@3306@bd_irdent

-- tablas usuarios y roles
CREATE TABLE Role (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL,
    descripcion TEXT
);

CREATE TABLE User (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE,
    estado ENUM('activo', 'inactivo') DEFAULT 'activo',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE UserRole (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    role_id INT,
    FOREIGN KEY (user_id) REFERENCES User (id),
    FOREIGN KEY (role_id) REFERENCES Role (id)
);

--tablas pacientes

CREATE TABLE Paciente (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    numero_documento VARCHAR(50) NOT NULL UNIQUE,
    tipo_documento ENUM(
        'DNI',
        'CARNETE EXTRANJERIA',
        'OTRO'
    ) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido_paterno VARCHAR(100),
    apellido_materno VARCHAR(100),
    fecha_nacimiento DATE,
    genero ENUM(
        'Femenino',
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
    ocupacion VARCHAR(100),
    estado ENUM('activo', 'inactivo') DEFAULT 'activo',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE ContactoPaciente (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_paciente BIGINT,
    telf_casa VARCHAR(15),
    telf_oficina VARCHAR(15),
    telf_celular VARCHAR(15),
    email VARCHAR(100),
    FOREIGN KEY (id_paciente) REFERENCES Paciente (id)
);

CREATE TABLE DireccionPaciente (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_paciente BIGINT,
    calle VARCHAR(100),
    referencia VARCHAR(100),
    departamento VARCHAR(100),
    distrito VARCHAR(100),
    provincia VARCHAR(40),
    pais VARCHAR(100),
    nro_exterior VARCHAR(40),
    FOREIGN KEY (id_paciente) REFERENCES Paciente (id)
);

--tablas doctores

CREATE TABLE Doctor (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    numero_documento VARCHAR(50) UNIQUE,
    tipo_documento ENUM(
        'DNI',
        'CARNETE EXTRANJERIA',
        'OTRO'
    ) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido_paterno VARCHAR(100),
    apellido_materno VARCHAR(100),
    especialidad VARCHAR(100),
    telefono VARCHAR(15),
    email VARCHAR(100),
    estado ENUM('activo', 'inactivo') DEFAULT 'activo',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- tablas dientes

CREATE TABLE Diente (
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
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE TipoMatriz (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo_diente ENUM(
        'incisivo',
        'canino',
        'premolar',
        'molar'
    ) UNIQUE NOT NULL,
    filas INT NOT NULL DEFAULT 3,
    columnas INT NOT NULL, -- 3 o 5 según tipo
    descripcion TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Posiciones específicas de cada matriz
CREATE TABLE PosicionMatriz (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_tipo_matriz INT NOT NULL,
    fila TINYINT NOT NULL, -- 0, 1, 2
    columna TINYINT NOT NULL, -- 0, 1, 2, 3, 4
    codigo VARCHAR(10) NOT NULL, -- 'V', 'V2', 'M', 'O', etc.
    cara_anatomica ENUM(
        'mesial',
        'distal',
        'oclusal',
        'vestibular',
        'lingual'
    ) NULL,
    ubicacion_especifica VARCHAR(50) NULL, -- 'tercio_cervical', 'cuspide_mesial', etc.
    es_activa BOOLEAN DEFAULT TRUE, -- FALSE para posiciones NULL
    descripcion TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_tipo_matriz) REFERENCES TipoMatriz (id) ON DELETE CASCADE,
    UNIQUE KEY unique_position (id_tipo_matriz, fila, columna),
    INDEX idx_tipo_codigo (id_tipo_matriz, codigo)
);

--   Instancias específicas de matriz por diente
CREATE TABLE MatrizDiente (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_diente INT NOT NULL,
    id_tipo_matriz INT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_diente) REFERENCES Diente (id) ON DELETE CASCADE,
    FOREIGN KEY (id_tipo_matriz) REFERENCES TipoMatriz (id),
    UNIQUE KEY unique_diente_matriz (id_diente)
);

CREATE TABLE Hallazgos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_hallazgo VARCHAR(100) NOT NULL,
    abreviacion VARCHAR(20),
    descripcion TEXT,
    tipo_hallazgo ENUM('diente', 'cara'),
    color VARCHAR(20),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Hallazgos_Paciente (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_diente INT NOT NULL,
    id_posicion_matriz INT NULL, -- Posición específica en matriz
    id_paciente BIGINT NOT NULL,
    id_doctor BIGINT NOT NULL,
    id_hallazgo INT NOT NULL,
    observaciones TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_diente) REFERENCES Diente (id),
    FOREIGN KEY (id_posicion_matriz) REFERENCES PosicionMatriz (id),
    FOREIGN KEY (id_paciente) REFERENCES Paciente (id),
    FOREIGN KEY (id_doctor) REFERENCES Doctor (id),
    FOREIGN KEY (id_hallazgo) REFERENCES Hallazgos (id),
    INDEX idx_paciente_diente (id_paciente, id_diente),
    INDEX idx_fecha_creacion (fecha_creacion)
);

-- modulo tratamiento

CREATE TABLE Plan_Tratamiento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_paciente BIGINT,
    fecha_inicio DATE,
    fecha_fin DATE,
    estado ENUM('activo', 'inactivo') DEFAULT 'activo',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_paciente) REFERENCES Paciente (id)
);

CREATE TABLE Tratamiento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_plan_tratamiento INT,
    id_doctor BIGINT,
    descripcion TEXT,
    costo DECIMAL(10, 2),
    duracion INT,
    estado ENUM('activo', 'inactivo') DEFAULT 'activo',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_plan_tratamiento) REFERENCES Plan_Tratamiento (id),
    FOREIGN KEY (id_doctor) REFERENCES Doctor (id)
);

CREATE TABLE Pago (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_tratamiento INT,
    monto DECIMAL(10, 2) NOT NULL,
    metodo_pago ENUM(
        'efectivo',
        'tarjeta',
        'transferencia'
    ),
    fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('pendiente', 'pagado') DEFAULT 'pendiente',
    FOREIGN KEY (id_tratamiento) REFERENCES Tratamiento (id)
);

-- tablas de historial clinico

CREATE TABLE Tipo_Registro_Clinico (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_tipo VARCHAR(100) NOT NULL,
    descripcion TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Registro_Clinico (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_paciente BIGINT,
    id_doctor BIGINT,
    id_tipo_registro INT,
    descripcion TEXT,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_paciente) REFERENCES Paciente (id),
    FOREIGN KEY (id_doctor) REFERENCES Doctor (id),
    FOREIGN KEY (id_tipo_registro) REFERENCES Tipo_Registro_Clinico (id)
);

-- tablas citas medicas

CREATE TABLE Cita (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_paciente BIGINT,
    id_doctor BIGINT,
    fecha DATETIME NOT NULL,
    motivo TEXT,
    estado ENUM(
        'pendiente',
        'confirmada',
        'cancelada',
        'realizada'
    ) DEFAULT 'pendiente',
    FOREIGN KEY (id_paciente) REFERENCES Paciente (id),
    FOREIGN KEY (id_doctor) REFERENCES Doctor (id)
);

-- VISTAS ÚTILES para consultas

-- Vista: Obtener matriz completa de un diente
CREATE VIEW Vista_Matriz_Diente AS
SELECT
    d.numero_diente,
    d.nombre_diente,
    d.tipo_diente,
    tm.filas,
    tm.columnas,
    pm.fila,
    pm.columna,
    pm.codigo,
    pm.cara_anatomica,
    pm.ubicacion_especifica,
    pm.es_activa,
    pm.descripcion as posicion_descripcion
FROM
    Diente d
    JOIN MatrizDiente md ON d.id = md.id_diente
    JOIN TipoMatriz tm ON md.id_tipo_matriz = tm.id
    JOIN PosicionMatriz pm ON tm.id = pm.id_tipo_matriz
ORDER BY d.numero_diente, pm.fila, pm.columna;

-- Vista: Hallazgos con información completa de posición
CREATE VIEW Vista_Hallazgos_Completos AS
SELECT
    hp.id,
    p.nombre as paciente_nombre,
    d.numero_diente,
    d.nombre_diente,
    pm.codigo as posicion_codigo,
    pm.cara_anatomica,
    pm.ubicacion_especifica,
    h.nombre_hallazgo,
    h.abreviacion,
    hp.observaciones,
    hp.fecha_creacion
FROM
    Hallazgos_Paciente hp
    JOIN Paciente p ON hp.id_paciente = p.id
    JOIN Diente d ON hp.id_diente = d.id
    LEFT JOIN PosicionMatriz pm ON hp.id_posicion_matriz = pm.id
    JOIN Hallazgos h ON hp.id_hallazgo = h.id;