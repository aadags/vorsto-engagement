/*
  Warnings:

  - A unique constraint covering the columns `[waba_id]` on the table `organizations` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[wa_phone_id]` on the table `organizations` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `organizations` ADD COLUMN `wa_phone_id` VARCHAR(191) NULL,
    ADD COLUMN `waba_id` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `organizations_waba_id_key` ON `organizations`(`waba_id`);

-- CreateIndex
CREATE UNIQUE INDEX `organizations_wa_phone_id_key` ON `organizations`(`wa_phone_id`);
