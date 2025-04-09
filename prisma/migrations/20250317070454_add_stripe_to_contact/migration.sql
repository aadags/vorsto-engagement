/*
  Warnings:

  - A unique constraint covering the columns `[organization_id,stripe_id]` on the table `contacts` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `contacts` ADD COLUMN `stripe_id` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `contacts_organization_id_stripe_id_key` ON `contacts`(`organization_id`, `stripe_id`);
