/*
  Warnings:

  - The primary key for the `bots` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `tools` DROP FOREIGN KEY `tools_bot_id_fkey`;

-- AlterTable
ALTER TABLE `bots` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `tools` MODIFY `bot_id` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `tools` ADD CONSTRAINT `tools_bot_id_fkey` FOREIGN KEY (`bot_id`) REFERENCES `bots`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
