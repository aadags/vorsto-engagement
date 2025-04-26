/*
  Warnings:

  - You are about to drop the column `stripeTransactionId` on the `orders` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[transactionId]` on the table `orders` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `orders_stripeTransactionId_key` ON `orders`;

-- AlterTable
ALTER TABLE `orders` DROP COLUMN `stripeTransactionId`,
    ADD COLUMN `transactionId` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `orders_transactionId_key` ON `orders`(`transactionId`);
