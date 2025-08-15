/*
  Warnings:

  - You are about to drop the column `required` on the `combo_items` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `combo_items` DROP COLUMN `required`;

-- CreateTable
CREATE TABLE `combo_rules` (
    `id` VARCHAR(191) NOT NULL,
    `product_id` VARCHAR(191) NOT NULL,
    `option_index` INTEGER NOT NULL,
    `label` VARCHAR(191) NULL,
    `required` BOOLEAN NOT NULL DEFAULT false,
    `min` INTEGER NULL,
    `max` INTEGER NULL,

    UNIQUE INDEX `combo_rules_product_id_option_index_key`(`product_id`, `option_index`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `combo_rules` ADD CONSTRAINT `combo_rules_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
