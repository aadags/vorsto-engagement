/*
  Warnings:

  - A unique constraint covering the columns `[uid]` on the table `devices` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `devices` ADD COLUMN `uid` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `devices_uid_key` ON `devices`(`uid`);
