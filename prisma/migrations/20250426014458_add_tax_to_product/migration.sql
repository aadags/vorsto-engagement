-- AlterTable
ALTER TABLE `products` ADD COLUMN `tax` INTEGER NULL,
    ADD COLUMN `tax_type` VARCHAR(191) NULL;
