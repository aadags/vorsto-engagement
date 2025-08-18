/*
  Warnings:

  - A unique constraint covering the columns `[stripe_id]` on the table `customers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[square_id]` on the table `customers` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `customers` ADD COLUMN `square_id` VARCHAR(191) NULL,
    ADD COLUMN `stripe_id` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `customers_stripe_id_key` ON `customers`(`stripe_id`);

-- CreateIndex
CREATE UNIQUE INDEX `customers_square_id_key` ON `customers`(`square_id`);
