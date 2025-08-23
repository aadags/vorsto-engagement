-- CreateTable
CREATE TABLE `deal_products` (
    `id` VARCHAR(191) NOT NULL,
    `dealId` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `customPrice` DOUBLE NULL,
    `discountType` ENUM('PERCENTAGE', 'FIXED', 'FLAT_PRICE') NULL,
    `discountValue` DOUBLE NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `deal_products` ADD CONSTRAINT `deal_products_dealId_fkey` FOREIGN KEY (`dealId`) REFERENCES `deals`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `deal_products` ADD CONSTRAINT `deal_products_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
