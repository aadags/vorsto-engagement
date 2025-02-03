-- AlterTable
ALTER TABLE `calls` ADD COLUMN `contact_id` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `conversations` ADD COLUMN `contact_id` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `conversations` ADD CONSTRAINT `conversations_contact_id_fkey` FOREIGN KEY (`contact_id`) REFERENCES `contacts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `calls` ADD CONSTRAINT `calls_contact_id_fkey` FOREIGN KEY (`contact_id`) REFERENCES `contacts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
