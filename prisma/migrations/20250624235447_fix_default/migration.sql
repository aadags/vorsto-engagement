-- AlterTable
ALTER TABLE `organizations` MODIFY `ai_auto_engage` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `ai_auto_feedBack` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `ai_auto_marketing` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `ai_human_take_over` BOOLEAN NOT NULL DEFAULT false;
