/*
  Warnings:

  - You are about to drop the column `account_id` on the `payment_processors` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `payment_processors` DROP COLUMN `account_id`,
    ADD COLUMN `access_token` VARCHAR(191) NULL,
    ADD COLUMN `public_token` VARCHAR(191) NULL,
    ADD COLUMN `refresh_token` VARCHAR(191) NULL,
    ADD COLUMN `ttl` VARCHAR(191) NULL;
