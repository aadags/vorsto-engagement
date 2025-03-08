-- CreateTable
CREATE TABLE `deleted_numbers` (
    `id` VARCHAR(191) NOT NULL,
    `number` VARCHAR(191) NULL,
    `voice` BOOLEAN NOT NULL,
    `sms` BOOLEAN NOT NULL,
    `locality` VARCHAR(191) NULL,
    `sid` VARCHAR(191) NULL,
    `organization_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `deleted_numbers_number_key`(`number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
