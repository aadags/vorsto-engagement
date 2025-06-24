-- AlterTable
ALTER TABLE `inventories` ADD COLUMN `barcode` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `loyalty_accounts` ADD COLUMN `card_codev` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `products` ADD COLUMN `sku` VARCHAR(191) NULL;
