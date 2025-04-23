/*
  Warnings:

  - You are about to drop the column `inventory_id` on the `carts` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `carts` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `carts` DROP FOREIGN KEY `carts_inventory_id_fkey`;

-- AlterTable
ALTER TABLE `carts` DROP COLUMN `inventory_id`,
    DROP COLUMN `quantity`;

-- CreateTable
CREATE TABLE `cart_items` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `inventory_id` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `cart_id` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `cart_items` ADD CONSTRAINT `cart_items_inventory_id_fkey` FOREIGN KEY (`inventory_id`) REFERENCES `inventories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cart_items` ADD CONSTRAINT `cart_items_cart_id_fkey` FOREIGN KEY (`cart_id`) REFERENCES `carts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
