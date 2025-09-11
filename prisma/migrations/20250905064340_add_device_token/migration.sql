/*
  Warnings:

  - A unique constraint covering the columns `[device_token]` on the table `customers` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `customers` ADD COLUMN `device_token` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `customers_device_token_key` ON `customers`(`device_token`);
