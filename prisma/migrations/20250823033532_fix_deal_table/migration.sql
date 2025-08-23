/*
  Warnings:

  - You are about to drop the `Deal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DealInventory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Deal` DROP FOREIGN KEY `Deal_organization_id_fkey`;

-- DropForeignKey
ALTER TABLE `DealInventory` DROP FOREIGN KEY `DealInventory_dealId_fkey`;

-- DropForeignKey
ALTER TABLE `DealInventory` DROP FOREIGN KEY `DealInventory_inventoryId_fkey`;

-- DropTable
DROP TABLE `Deal`;

-- DropTable
DROP TABLE `DealInventory`;

-- CreateTable
CREATE TABLE `deals` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `imageUrl` VARCHAR(191) NULL,
    `type` ENUM('ONE_OFF', 'RECURRING') NOT NULL,
    `startDate` DATETIME(3) NULL,
    `endDate` DATETIME(3) NULL,
    `recurrenceRule` JSON NULL,
    `discountType` ENUM('PERCENTAGE', 'FIXED', 'FLAT_PRICE') NULL,
    `discountValue` DOUBLE NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `organization_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `deal_inventories` (
    `id` VARCHAR(191) NOT NULL,
    `dealId` VARCHAR(191) NOT NULL,
    `inventoryId` VARCHAR(191) NOT NULL,
    `customPrice` DOUBLE NULL,
    `discountType` ENUM('PERCENTAGE', 'FIXED', 'FLAT_PRICE') NULL,
    `discountValue` DOUBLE NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `deals` ADD CONSTRAINT `deals_organization_id_fkey` FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `deal_inventories` ADD CONSTRAINT `deal_inventories_dealId_fkey` FOREIGN KEY (`dealId`) REFERENCES `deals`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `deal_inventories` ADD CONSTRAINT `deal_inventories_inventoryId_fkey` FOREIGN KEY (`inventoryId`) REFERENCES `inventories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
