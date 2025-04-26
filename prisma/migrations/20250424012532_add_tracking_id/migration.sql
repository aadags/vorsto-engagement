/*
  Warnings:

  - A unique constraint covering the columns `[tracking_id]` on the table `orders` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `orders` ADD COLUMN `tracking_id` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `orders_tracking_id_key` ON `orders`(`tracking_id`);
