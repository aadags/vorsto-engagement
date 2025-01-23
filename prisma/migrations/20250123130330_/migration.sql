/*
  Warnings:

  - A unique constraint covering the columns `[conferenceId]` on the table `calls` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `calls_conferenceId_key` ON `calls`(`conferenceId`);
