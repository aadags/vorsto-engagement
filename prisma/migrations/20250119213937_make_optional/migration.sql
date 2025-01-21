-- DropForeignKey
ALTER TABLE `call_queues` DROP FOREIGN KEY `call_queues_user_id_fkey`;

-- AlterTable
ALTER TABLE `call_queues` MODIFY `user_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `call_queues` ADD CONSTRAINT `call_queues_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
