-- CreateTable
CREATE TABLE "Usuario" (
    "cedula" INTEGER NOT NULL,
    "nombre_completo" TEXT NOT NULL,
    "correo_electronico" TEXT NOT NULL,
    "contrasena" TEXT NOT NULL,
    "rol" CHAR(1) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("cedula")
);

-- CreateTable
CREATE TABLE "Diagnostico" (
    "id" SERIAL NOT NULL,
    "shareLink" VARCHAR(255),
    "enlaceFoto" VARCHAR(255) NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "calificacion" INTEGER,
    "enlaceVideo" VARCHAR(255) NOT NULL,
    "descripcion" VARCHAR(255) NOT NULL,
    "edadGestacional" VARCHAR(255) NOT NULL,
    "medicoId" INTEGER NOT NULL,
    "pacienteId" INTEGER NOT NULL,

    CONSTRAINT "Diagnostico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SolicitudSoporte" (
    "id" TEXT NOT NULL,
    "titulo" VARCHAR(100) NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "tipo" CHAR(1) NOT NULL,
    "descripcion" VARCHAR(255) NOT NULL,
    "solicitanteId" INTEGER NOT NULL,
    "encargadoId" INTEGER,

    CONSTRAINT "SolicitudSoporte_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mensaje" (
    "id" TEXT NOT NULL,
    "descripcion" VARCHAR(255) NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "solicitudId" TEXT NOT NULL,

    CONSTRAINT "Mensaje_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Diagnostico" ADD CONSTRAINT "Diagnostico_medicoId_fkey" FOREIGN KEY ("medicoId") REFERENCES "Usuario"("cedula") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Diagnostico" ADD CONSTRAINT "Diagnostico_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Usuario"("cedula") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolicitudSoporte" ADD CONSTRAINT "SolicitudSoporte_solicitanteId_fkey" FOREIGN KEY ("solicitanteId") REFERENCES "Usuario"("cedula") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolicitudSoporte" ADD CONSTRAINT "SolicitudSoporte_encargadoId_fkey" FOREIGN KEY ("encargadoId") REFERENCES "Usuario"("cedula") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mensaje" ADD CONSTRAINT "Mensaje_solicitudId_fkey" FOREIGN KEY ("solicitudId") REFERENCES "SolicitudSoporte"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
