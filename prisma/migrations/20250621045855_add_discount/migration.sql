-- AlterTable
ALTER TABLE `membership_plans` ADD COLUMN `cashback_percent` DOUBLE NULL DEFAULT 0,
    ADD COLUMN `discount_percent` DOUBLE NULL DEFAULT 0;
