/*
  Warnings:

  - You are about to alter the column `point_rate` on the `loyalty_programs` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `redeem_rate` on the `loyalty_programs` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.

*/
-- AlterTable
ALTER TABLE `loyalty_programs` MODIFY `point_rate` DOUBLE NOT NULL,
    MODIFY `redeem_rate` DOUBLE NOT NULL;
