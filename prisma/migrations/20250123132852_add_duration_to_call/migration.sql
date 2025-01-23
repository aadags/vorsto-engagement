/*
  Warnings:

  - You are about to drop the column `ended_at` on the `calls` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `calls` DROP COLUMN `ended_at`,
    ADD COLUMN `duration` INTEGER NULL;
