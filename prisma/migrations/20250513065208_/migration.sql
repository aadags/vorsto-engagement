/*
  Warnings:

  - A unique constraint covering the columns `[cloud_id]` on the table `images` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `images_cloud_id_key` ON `images`(`cloud_id`);
