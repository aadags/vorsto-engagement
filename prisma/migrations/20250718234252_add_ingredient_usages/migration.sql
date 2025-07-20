/*
  Warnings:

  - Added the required column `inventory_id` to the `ingredients_usage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ingredients_usage` ADD COLUMN `inventory_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `ingredients_usage` ADD CONSTRAINT `ingredients_usage_inventory_id_fkey` FOREIGN KEY (`inventory_id`) REFERENCES `inventories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
