/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `calls` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `calls_userId_key` ON `calls`(`userId`);
