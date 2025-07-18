-- AlterTable
ALTER TABLE `organizations` ADD COLUMN `parent_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `organizations` ADD CONSTRAINT `organizations_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `organizations`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
