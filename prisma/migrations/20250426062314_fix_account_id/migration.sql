/*
  Warnings:

  - You are about to drop the column `currency` on the `products` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[organization_id,accountId]` on the table `payment_processors` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `payment_processors_accountId_key` ON `payment_processors`;

-- AlterTable
ALTER TABLE `products` DROP COLUMN `currency`;

-- CreateIndex
CREATE UNIQUE INDEX `payment_processors_organization_id_accountId_key` ON `payment_processors`(`organization_id`, `accountId`);
