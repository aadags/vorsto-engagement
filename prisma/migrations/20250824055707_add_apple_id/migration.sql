/*
  Warnings:

  - A unique constraint covering the columns `[apple_id]` on the table `customers` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `customers` ADD COLUMN `apple_id` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `customers_apple_id_key` ON `customers`(`apple_id`);
