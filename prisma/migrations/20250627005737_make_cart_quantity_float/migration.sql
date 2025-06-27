/*
  Warnings:

  - You are about to drop the column `weight` on the `cart_items` table. All the data in the column will be lost.
  - You are about to alter the column `quantity` on the `cart_items` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.

*/
-- AlterTable
ALTER TABLE `cart_items` DROP COLUMN `weight`,
    MODIFY `quantity` DOUBLE NOT NULL;
