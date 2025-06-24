-- AlterTable
ALTER TABLE `cart_items` ADD COLUMN `weight` DOUBLE NULL;

-- AlterTable
ALTER TABLE `inventories` ADD COLUMN `min_weight` DOUBLE NULL,
    ADD COLUMN `price_unit` VARCHAR(191) NULL,
    ADD COLUMN `weight_available` DOUBLE NULL,
    ADD COLUMN `weight_step` DOUBLE NULL;

-- AlterTable
ALTER TABLE `order_items` ADD COLUMN `weight` DOUBLE NULL;

-- AlterTable
ALTER TABLE `products` ADD COLUMN `measurement_type` VARCHAR(191) NOT NULL DEFAULT 'unit';
