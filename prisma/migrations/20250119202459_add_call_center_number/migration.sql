/*
  Warnings:

  - A unique constraint covering the columns `[call_center_number]` on the table `organizations` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `organizations` ADD COLUMN `call_center_number` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `organizations_call_center_number_key` ON `organizations`(`call_center_number`);
