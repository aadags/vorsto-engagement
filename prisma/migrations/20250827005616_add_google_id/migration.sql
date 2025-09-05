/*
  Warnings:

  - A unique constraint covering the columns `[google_id]` on the table `customers` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `customers` ADD COLUMN `google_id` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `customers_google_id_key` ON `customers`(`google_id`);
