/*
  Warnings:

  - Changed the type of `diapers` on the `DailyTransmission` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `meals` on the `DailyTransmission` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `sleep` on the `DailyTransmission` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "DailyTransmission" DROP COLUMN "diapers",
ADD COLUMN     "diapers" INTEGER NOT NULL,
DROP COLUMN "meals",
ADD COLUMN     "meals" INTEGER NOT NULL,
DROP COLUMN "sleep",
ADD COLUMN     "sleep" INTEGER NOT NULL;
