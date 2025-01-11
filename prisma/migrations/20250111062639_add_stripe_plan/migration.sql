/*
  Warnings:

  - A unique constraint covering the columns `[stripe_id]` on the table `organizations` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `organizations` ADD COLUMN `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `plan` VARCHAR(191) NOT NULL DEFAULT 'free',
    ADD COLUMN `plan_id` VARCHAR(191) NULL,
    ADD COLUMN `stripe_id` VARCHAR(191) NULL,
    ADD COLUMN `updated_at` DATETIME(3) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `organizations_stripe_id_key` ON `organizations`(`stripe_id`);
