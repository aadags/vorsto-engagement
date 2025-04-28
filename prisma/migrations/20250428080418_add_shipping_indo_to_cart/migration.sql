/*
  Warnings:

  - You are about to drop the column `shipping_price` on the `carts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `carts` DROP COLUMN `shipping_price`,
    ADD COLUMN `shipping_info` LONGTEXT NULL;
