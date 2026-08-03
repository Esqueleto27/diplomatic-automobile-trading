-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "asunto" TEXT NOT NULL,
    "mensaje" TEXT NOT NULL,
    "leido" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ContactMessage_leido_idx" ON "ContactMessage"("leido");
