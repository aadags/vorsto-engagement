-- AlterTable
ALTER TABLE `organizations` ADD COLUMN `ai_auto_engage` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `ai_auto_feedBack` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `ai_auto_marketing` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `ai_human_take_over` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `ai_system_bio` BOOLEAN NOT NULL DEFAULT true;
