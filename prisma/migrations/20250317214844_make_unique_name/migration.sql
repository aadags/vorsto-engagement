/*
  Warnings:

  - A unique constraint covering the columns `[organization_id,name]` on the table `payment_processors` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `payment_processors_organization_id_name_key` ON `payment_processors`(`organization_id`, `name`);
