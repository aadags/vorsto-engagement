/*
  Warnings:

  - A unique constraint covering the columns `[barcode]` on the table `inventories` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `inventories_barcode_key` ON `inventories`(`barcode`);
