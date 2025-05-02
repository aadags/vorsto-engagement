/*
  Warnings:

  - You are about to drop the column `stripePriceId` on the `inventories` table. All the data in the column will be lost.
  - You are about to drop the column `stripeProductId` on the `products` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `inventories_stripePriceId_key` ON `inventories`;

-- DropIndex
DROP INDEX `products_stripeProductId_key` ON `products`;

-- AlterTable
ALTER TABLE `inventories` DROP COLUMN `stripePriceId`;

-- AlterTable
ALTER TABLE `products` DROP COLUMN `stripeProductId`;
