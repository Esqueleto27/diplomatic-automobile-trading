-- CreateEnum
CREATE TYPE "TipoAuto" AS ENUM ('NUEVO', 'USADO', 'DIPLOMATICO');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Car" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "marca" TEXT,
    "anio" INTEGER,
    "precio" INTEGER,
    "kilometraje" INTEGER,
    "transmision" TEXT,
    "combustible" TEXT,
    "color" TEXT,
    "descripcion" TEXT,
    "tipo" "TipoAuto",
    "destacado" BOOLEAN NOT NULL DEFAULT false,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Car_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarPhoto" (
    "id" TEXT NOT NULL,
    "carId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "portada" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CarPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Car_slug_key" ON "Car"("slug");

-- CreateIndex
CREATE INDEX "Car_tipo_idx" ON "Car"("tipo");

-- CreateIndex
CREATE INDEX "Car_destacado_idx" ON "Car"("destacado");

-- CreateIndex
CREATE INDEX "CarPhoto_carId_idx" ON "CarPhoto"("carId");

-- AddForeignKey
ALTER TABLE "CarPhoto" ADD CONSTRAINT "CarPhoto_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE CASCADE ON UPDATE CASCADE;
