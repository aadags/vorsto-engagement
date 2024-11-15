/*
  Warnings:

  - A unique constraint covering the columns `[uid]` on the table `organizations` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `uid` to the `organizations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `organizations` ADD COLUMN `uid` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `organizations_uid_key` ON `organizations`(`uid`);
