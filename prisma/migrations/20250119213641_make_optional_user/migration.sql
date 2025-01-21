-- DropForeignKey
ALTER TABLE `calls` DROP FOREIGN KEY `calls_user_id_fkey`;

-- AlterTable
ALTER TABLE `calls` MODIFY `user_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `calls` ADD CONSTRAINT `calls_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
