/*
  Warnings:

  - You are about to drop the column `currency` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `users` DROP COLUMN `currency`,
    ADD COLUMN `location` VARCHAR(191) NULL;