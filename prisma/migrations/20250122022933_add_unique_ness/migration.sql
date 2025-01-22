/*
  Warnings:

  - A unique constraint covering the columns `[from]` on the table `call_queues` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[conferenceId]` on the table `call_queues` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `call_queues_from_key` ON `call_queues`(`from`);

-- CreateIndex
CREATE UNIQUE INDEX `call_queues_conferenceId_key` ON `call_queues`(`conferenceId`);
