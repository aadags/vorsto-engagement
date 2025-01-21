/*
  Warnings:

  - You are about to drop the column `createdAt` on the `calls` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `calls` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `calls` table. All the data in the column will be lost.
  - Added the required column `organization_id` to the `calls` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `calls` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `calls` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `calls` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `calls_userId_key` ON `calls`;

-- AlterTable
ALTER TABLE `calls` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`,
    DROP COLUMN `userId`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `ended_at` DATETIME(3) NULL,
    ADD COLUMN `organization_id` INTEGER NOT NULL,
    ADD COLUMN `status` VARCHAR(191) NOT NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL,
    ADD COLUMN `user_id` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `call_queues` (
    `id` VARCHAR(191) NOT NULL,
    `from` VARCHAR(191) NOT NULL,
    `conferenceId` VARCHAR(191) NOT NULL,
    `user_id` INTEGER NOT NULL,
    `organization_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `call_queues_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `call_queues` ADD CONSTRAINT `call_queues_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `call_queues` ADD CONSTRAINT `call_queues_organization_id_fkey` FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `calls` ADD CONSTRAINT `calls_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `calls` ADD CONSTRAINT `calls_organization_id_fkey` FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
