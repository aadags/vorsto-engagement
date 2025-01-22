/*
  Warnings:

  - Added the required column `organization_id` to the `live_call_agents` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `live_call_agents` ADD COLUMN `organization_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `live_call_agents` ADD CONSTRAINT `live_call_agents_organization_id_fkey` FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
