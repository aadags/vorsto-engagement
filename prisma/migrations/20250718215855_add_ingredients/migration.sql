-- CreateTable
CREATE TABLE `ingredients` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `organization_id` INTEGER NOT NULL,
    `unit_type` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NULL,
    `weight_available` DOUBLE NULL,
    `price_per_unit` INTEGER NULL,
    `price_per_weight` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ingredients_purchase` (
    `id` VARCHAR(191) NOT NULL,
    `ingredient_id` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NULL,
    `weight` DOUBLE NULL,
    `cost` INTEGER NOT NULL,
    `supplier` VARCHAR(191) NULL,
    `purchase_date` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ingredients_usage` (
    `id` VARCHAR(191) NOT NULL,
    `ingredient_id` VARCHAR(191) NOT NULL,
    `usage_quantity` INTEGER NULL,
    `usage_weight` DOUBLE NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ingredients` ADD CONSTRAINT `ingredients_organization_id_fkey` FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ingredients_purchase` ADD CONSTRAINT `ingredients_purchase_ingredient_id_fkey` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ingredients_usage` ADD CONSTRAINT `ingredients_usage_ingredient_id_fkey` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
