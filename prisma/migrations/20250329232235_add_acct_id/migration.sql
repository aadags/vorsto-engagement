/*
  Warnings:

  - A unique constraint covering the columns `[accountId]` on the table `payment_processors` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `accountId` to the `payment_processors` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `payment_processors` ADD COLUMN `accountId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `payment_processors_accountId_key` ON `payment_processors`(`accountId`);
