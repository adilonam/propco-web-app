/*
  Warnings:

  - You are about to drop the column `cryptoAdress` on the `ClaimRequest` table. All the data in the column will be lost.
  - Added the required column `cryptoAddress` to the `ClaimRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ClaimRequest" DROP COLUMN "cryptoAdress",
ADD COLUMN     "cryptoAddress" TEXT NOT NULL;
