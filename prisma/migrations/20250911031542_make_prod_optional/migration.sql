-- DropForeignKey
ALTER TABLE `reviews` DROP FOREIGN KEY `reviews_product_id_fkey`;

-- AlterTable
ALTER TABLE `reviews` MODIFY `product_id` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
