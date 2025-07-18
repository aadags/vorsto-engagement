/*
  Warnings:

  - You are about to drop the column `locationId` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the `locations` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `locations` DROP FOREIGN KEY `locations_organization_id_fkey`;

-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `orders_locationId_fkey`;

-- AlterTable
ALTER TABLE `orders` DROP COLUMN `locationId`;

-- DropTable
DROP TABLE `locations`;
