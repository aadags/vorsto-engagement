/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `bots` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `bots_name_key` ON `bots`(`name`);
