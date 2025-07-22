/*
  Warnings:

  - You are about to alter the column `price` on the `ingredients` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `cost` on the `ingredients_purchase` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.

*/
-- AlterTable
ALTER TABLE `ingredients` MODIFY `price` DOUBLE NULL;

-- AlterTable
ALTER TABLE `ingredients_purchase` MODIFY `cost` DOUBLE NOT NULL;
