-- AlterTable
ALTER TABLE `devices` ADD COLUMN `name` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `terminals` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(191) NULL,
    `token` VARCHAR(191) NOT NULL,
    `organization_id` INTEGER NOT NULL,
    `device_id` INTEGER NOT NULL,

    UNIQUE INDEX `terminals_token_key`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `terminals` ADD CONSTRAINT `terminals_organization_id_fkey` FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `terminals` ADD CONSTRAINT `terminals_device_id_fkey` FOREIGN KEY (`device_id`) REFERENCES `devices`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
