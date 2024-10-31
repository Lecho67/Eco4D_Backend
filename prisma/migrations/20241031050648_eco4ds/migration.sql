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
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "calificacion" INTEGER,
    "enlaceVideo" VARCHAR(255) NOT NULL,
    "descripcion" TEXT NOT NULL,
    "edadGestacional" VARCHAR(255) NOT NULL,
    "medicoId" INTEGER NOT NULL,
    "pacienteId" INTEGER NOT NULL,

    CONSTRAINT "Diagnostico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SolicitudSoporte" (
    "id" TEXT NOT NULL,
    "titulo" VARCHAR(100) NOT NULL,
    "fechaReporte" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaSolucion" TIMESTAMP(3),
    "tipo" VARCHAR(255) NOT NULL,
    "descripcion" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'A',
    "solicitanteId" INTEGER NOT NULL,

    CONSTRAINT "SolicitudSoporte_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mensaje" (
    "id" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "solicitudId" TEXT NOT NULL,
    "autorId" INTEGER NOT NULL,

    CONSTRAINT "Mensaje_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_correo_electronico_key" ON "Usuario"("correo_electronico");

-- CreateIndex
CREATE INDEX "Diagnostico_medicoId_idx" ON "Diagnostico"("medicoId");

-- CreateIndex
CREATE INDEX "Diagnostico_pacienteId_idx" ON "Diagnostico"("pacienteId");

-- CreateIndex
CREATE INDEX "SolicitudSoporte_solicitanteId_idx" ON "SolicitudSoporte"("solicitanteId");

-- CreateIndex
CREATE INDEX "Mensaje_solicitudId_idx" ON "Mensaje"("solicitudId");

-- CreateIndex
CREATE INDEX "Mensaje_autorId_idx" ON "Mensaje"("autorId");

-- AddForeignKey
ALTER TABLE "Diagnostico" ADD CONSTRAINT "Diagnostico_medicoId_fkey" FOREIGN KEY ("medicoId") REFERENCES "Usuario"("cedula") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Diagnostico" ADD CONSTRAINT "Diagnostico_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Usuario"("cedula") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolicitudSoporte" ADD CONSTRAINT "SolicitudSoporte_solicitanteId_fkey" FOREIGN KEY ("solicitanteId") REFERENCES "Usuario"("cedula") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mensaje" ADD CONSTRAINT "Mensaje_solicitudId_fkey" FOREIGN KEY ("solicitudId") REFERENCES "SolicitudSoporte"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mensaje" ADD CONSTRAINT "Mensaje_autorId_fkey" FOREIGN KEY ("autorId") REFERENCES "Usuario"("cedula") ON DELETE RESTRICT ON UPDATE CASCADE;
