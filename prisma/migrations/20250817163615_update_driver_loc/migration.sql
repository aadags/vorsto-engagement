/*
  Warnings:

  - You are about to alter the column `driver_location` on the `orders` table. The data in that column could be lost. The data in that column will be cast from `LongText` to `Json`.

*/
-- AlterTable
ALTER TABLE `orders` MODIFY `driver_location` JSON NULL;
