/*
  Warnings:

  - You are about to drop the column `receiverId` on the `transferences` table. All the data in the column will be lost.
  - You are about to drop the column `senderId` on the `transferences` table. All the data in the column will be lost.
  - Added the required column `creditorId` to the `transferences` table without a default value. This is not possible if the table is not empty.
  - Added the required column `debitorId` to the `transferences` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "transferences" DROP CONSTRAINT "transferences_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "transferences" DROP CONSTRAINT "transferences_senderId_fkey";

-- AlterTable
-- ALTER TABLE "transferences" DROP COLUMN "receiverId",
-- DROP COLUMN "senderId",
-- ADD COLUMN     "creditorId" INTEGER NOT NULL,
-- ADD COLUMN     "debitorId" INTEGER NOT NULL;

-- Rename columns
ALTER TABLE "transferences" RENAME COLUMN "receiverId" TO "creditorId";
ALTER TABLE "transferences" RENAME COLUMN "senderId" TO "debitorId";

-- AddForeignKey
ALTER TABLE "transferences" ADD CONSTRAINT "transferences_creditorId_fkey" FOREIGN KEY ("creditorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transferences" ADD CONSTRAINT "transferences_debitorId_fkey" FOREIGN KEY ("debitorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
