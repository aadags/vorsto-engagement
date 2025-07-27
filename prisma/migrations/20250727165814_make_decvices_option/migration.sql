-- DropForeignKey
ALTER TABLE `terminals` DROP FOREIGN KEY `terminals_device_id_fkey`;

-- AlterTable
ALTER TABLE `terminals` MODIFY `device_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `terminals` ADD CONSTRAINT `terminals_device_id_fkey` FOREIGN KEY (`device_id`) REFERENCES `devices`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
