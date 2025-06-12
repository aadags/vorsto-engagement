/*
  Warnings:

  - You are about to alter the column `ai_system_bio` on the `organizations` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `organizations` MODIFY `ai_system_bio` VARCHAR(191) NULL;
