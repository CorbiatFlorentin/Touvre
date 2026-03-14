-- Add shared form id and mechoui participant fields
ALTER TABLE "inscription" ADD COLUMN "formulaire_id" INTEGER;
ALTER TABLE "inscription" ADD COLUMN "prenom" TEXT;
ALTER TABLE "inscription" ADD COLUMN "tarif" TEXT;

-- Grouping index for mechoui submissions
CREATE INDEX "inscription_formulaire_id_idx" ON "inscription"("formulaire_id");
