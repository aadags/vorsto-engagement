-- AlterTable
ALTER TABLE `reviews` ADD COLUMN `organization_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_organization_id_fkey` FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
