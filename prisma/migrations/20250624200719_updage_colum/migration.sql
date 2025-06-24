/*
  Warnings:

  - You are about to drop the column `card_codev` on the `loyalty_accounts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `loyalty_accounts` DROP COLUMN `card_codev`,
    ADD COLUMN `card_code` VARCHAR(191) NULL;
