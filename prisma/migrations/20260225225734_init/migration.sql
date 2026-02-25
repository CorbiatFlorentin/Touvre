-- CreateTable
CREATE TABLE "inscription" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "accompte_verser" BOOLEAN NOT NULL DEFAULT false,
    "accompteMontant" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "admin" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_login_at" DATETIME
);

-- CreateIndex
CREATE INDEX "inscription_event_idx" ON "inscription"("event");

-- CreateIndex
CREATE UNIQUE INDEX "admin_email_key" ON "admin"("email");
