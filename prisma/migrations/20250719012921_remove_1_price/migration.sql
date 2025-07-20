/*
  Warnings:

  - You are about to drop the column `price_per_unit` on the `ingredients` table. All the data in the column will be lost.
  - You are about to drop the column `price_per_weight` on the `ingredients` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `ingredients` DROP COLUMN `price_per_unit`,
    DROP COLUMN `price_per_weight`,
    ADD COLUMN `price` INTEGER NULL;
