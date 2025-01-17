/*
  Warnings:

  - Added the required column `from` to the `calls` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `calls` ADD COLUMN `from` VARCHAR(191) NOT NULL;
