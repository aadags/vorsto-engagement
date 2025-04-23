/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `carts` will be added. If there are existing duplicate values, this will fail.
  - Made the column `uuid` on table `carts` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `carts` MODIFY `uuid` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `carts_uuid_key` ON `carts`(`uuid`);
