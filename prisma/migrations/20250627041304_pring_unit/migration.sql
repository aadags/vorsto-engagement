/*
  Warnings:

  - You are about to drop the column `weight` on the `order_items` table. All the data in the column will be lost.
  - You are about to alter the column `quantity` on the `order_items` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.

*/
-- AlterTable
ALTER TABLE `inventories` MODIFY `price_unit` VARCHAR(191) NULL DEFAULT 'unit';

-- AlterTable
ALTER TABLE `order_items` DROP COLUMN `weight`,
    ADD COLUMN `price_unit` VARCHAR(191) NULL DEFAULT 'unit',
    MODIFY `quantity` DOUBLE NOT NULL;
