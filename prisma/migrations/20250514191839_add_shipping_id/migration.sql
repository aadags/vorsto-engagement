/*
  Warnings:

  - You are about to drop the column `shipper_id` on the `orders` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[shipping_id]` on the table `orders` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `orders_shipper_id_key` ON `orders`;

-- AlterTable
ALTER TABLE `orders` DROP COLUMN `shipper_id`,
    ADD COLUMN `shipping_id` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `orders_shipping_id_key` ON `orders`(`shipping_id`);
