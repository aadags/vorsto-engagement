-- AlterTable
ALTER TABLE `payment_processors` ADD COLUMN `hook_secret` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `orders` (
    `id` VARCHAR(191) NOT NULL,
    `contact` VARCHAR(191) NULL,
    `product` VARCHAR(191) NULL,
    `quantity` VARCHAR(191) NULL,
    `amount` INTEGER NULL,
    `status` VARCHAR(191) NULL,
    `order_date` INTEGER NULL,
    `organization_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_organization_id_fkey` FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
