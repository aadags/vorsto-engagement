/*
  Warnings:

  - A unique constraint covering the columns `[ig_user_id]` on the table `organizations` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `organizations` ADD COLUMN `ig_token` LONGTEXT NULL,
    ADD COLUMN `ig_user_id` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `organizations_ig_user_id_key` ON `organizations`(`ig_user_id`);
