/*
  Warnings:

  - You are about to drop the column `amount` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `contact` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `order_date` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `product_id` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `orders` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[stripeTransactionId]` on the table `orders` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `stripeTransactionId` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_price` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `orders_product_id_fkey`;

-- AlterTable
ALTER TABLE `inventories` ADD COLUMN `active` BOOLEAN NULL DEFAULT true;

-- AlterTable
ALTER TABLE `orders` DROP COLUMN `amount`,
    DROP COLUMN `contact`,
    DROP COLUMN `order_date`,
    DROP COLUMN `product_id`,
    DROP COLUMN `quantity`,
    DROP COLUMN `status`,
    ADD COLUMN `stripeTransactionId` VARCHAR(191) NOT NULL,
    ADD COLUMN `total_price` INTEGER NOT NULL,
    ALTER COLUMN `updated_at` DROP DEFAULT;

-- CreateTable
CREATE TABLE `order_items` (
    `id` VARCHAR(191) NOT NULL,
    `inventory_id` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `tax` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `orders_stripeTransactionId_key` ON `orders`(`stripeTransactionId`);

-- AddForeignKey
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_inventory_id_fkey` FOREIGN KEY (`inventory_id`) REFERENCES `inventories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
