/*
  Warnings:

  - You are about to drop the column `bot_id` on the `tools` table. All the data in the column will be lost.
  - You are about to drop the `bots` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `bots` DROP FOREIGN KEY `bots_organization_id_fkey`;

-- DropForeignKey
ALTER TABLE `tools` DROP FOREIGN KEY `tools_bot_id_fkey`;

-- AlterTable
ALTER TABLE `tools` DROP COLUMN `bot_id`,
    ADD COLUMN `agent_id` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `bots`;

-- CreateTable
CREATE TABLE `agents` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `human_takeover` BOOLEAN NOT NULL DEFAULT true,
    `category` VARCHAR(191) NULL DEFAULT 'Custom',
    `system_bio` LONGTEXT NOT NULL,
    `model` VARCHAR(191) NULL,
    `output_type` VARCHAR(191) NULL DEFAULT 'text',
    `output_parameters` LONGTEXT NULL,
    `organization_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `agents` ADD CONSTRAINT `agents_organization_id_fkey` FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tools` ADD CONSTRAINT `tools_agent_id_fkey` FOREIGN KEY (`agent_id`) REFERENCES `agents`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
