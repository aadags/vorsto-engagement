/*
  Warnings:

  - A unique constraint covering the columns `[support_email]` on the table `organizations` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `organizations` ADD COLUMN `support_email` VARCHAR(191) NULL,
    ADD COLUMN `support_email_connection` LONGTEXT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `organizations_support_email_key` ON `organizations`(`support_email`);
