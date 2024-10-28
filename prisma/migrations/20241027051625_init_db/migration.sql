/*
  Warnings:

  - You are about to drop the column `created_at` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `gpt_token` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `organization` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `plan` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `plan_status` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `stripe_id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `whitelist_ext` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `bots` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `datasources` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `jobs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `keys` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `paystacks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tools` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `whitelists` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `organization_id` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `bots` DROP FOREIGN KEY `bots_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `datasources` DROP FOREIGN KEY `datasources_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `jobs` DROP FOREIGN KEY `jobs_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `keys` DROP FOREIGN KEY `keys_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `tools` DROP FOREIGN KEY `tools_bot_id_fkey`;

-- DropForeignKey
ALTER TABLE `whitelists` DROP FOREIGN KEY `whitelists_user_id_fkey`;

-- DropIndex
DROP INDEX `users_stripe_id_key` ON `users`;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `created_at`,
    DROP COLUMN `gpt_token`,
    DROP COLUMN `location`,
    DROP COLUMN `organization`,
    DROP COLUMN `plan`,
    DROP COLUMN `plan_status`,
    DROP COLUMN `stripe_id`,
    DROP COLUMN `updated_at`,
    DROP COLUMN `whitelist_ext`,
    ADD COLUMN `organization_id` INTEGER NOT NULL;

-- DropTable
DROP TABLE `bots`;

-- DropTable
DROP TABLE `datasources`;

-- DropTable
DROP TABLE `jobs`;

-- DropTable
DROP TABLE `keys`;

-- DropTable
DROP TABLE `paystacks`;

-- DropTable
DROP TABLE `tools`;

-- DropTable
DROP TABLE `whitelists`;

-- CreateTable
CREATE TABLE `organizations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `conversations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `body` LONGTEXT NULL,
    `user_id` INTEGER NULL,
    `organization_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_organization_id_fkey` FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `conversations` ADD CONSTRAINT `conversations_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `conversations` ADD CONSTRAINT `conversations_organization_id_fkey` FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
