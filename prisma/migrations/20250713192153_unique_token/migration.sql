/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `devices` will be added. If there are existing duplicate values, this will fail.
  - Made the column `token` on table `devices` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `devices` MODIFY `token` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `devices_token_key` ON `devices`(`token`);
