-- CreateTable
CREATE TABLE `numbers` (
    `id` VARCHAR(191) NOT NULL,
    `number` VARCHAR(191) NULL,
    `voice` BOOLEAN NOT NULL,
    `sms` BOOLEAN NOT NULL,
    `plan` VARCHAR(191) NOT NULL,
    `organization_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `numbers_number_key`(`number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `numbers` ADD CONSTRAINT `numbers_organization_id_fkey` FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
