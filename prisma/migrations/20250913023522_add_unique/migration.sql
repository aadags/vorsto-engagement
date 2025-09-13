/*
  Warnings:

  - A unique constraint covering the columns `[order_id]` on the table `reviews` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `reviews_order_id_key` ON `reviews`(`order_id`);
