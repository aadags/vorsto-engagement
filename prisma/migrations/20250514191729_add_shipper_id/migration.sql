/*
  Warnings:

  - A unique constraint covering the columns `[shipper_id]` on the table `orders` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `orders` ADD COLUMN `shipper_id` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `orders_shipper_id_key` ON `orders`(`shipper_id`);
