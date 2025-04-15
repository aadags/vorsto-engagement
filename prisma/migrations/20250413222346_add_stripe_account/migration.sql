/*
  Warnings:

  - A unique constraint covering the columns `[stripe_account_id]` on the table `organizations` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `organizations` ADD COLUMN `stripe_account_id` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `organizations_stripe_account_id_key` ON `organizations`(`stripe_account_id`);
