/*
  Warnings:

  - A unique constraint covering the columns `[organization_id]` on the table `bots` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `bots_organization_id_key` ON `bots`(`organization_id`);
