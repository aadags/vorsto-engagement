-- AlterTable
ALTER TABLE `users` ADD COLUMN `plan` VARCHAR(191) NOT NULL DEFAULT 'free',
    ADD COLUMN `stripe_id` VARCHAR(191) NULL;
