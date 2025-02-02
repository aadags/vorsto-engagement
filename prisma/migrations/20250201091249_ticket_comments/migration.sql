-- CreateTable
CREATE TABLE `comments` (
    `id` VARCHAR(191) NOT NULL,
    `body` LONGTEXT NOT NULL,
    `ticket_id` VARCHAR(191) NOT NULL,
    `user_id` INTEGER NOT NULL,
    `organization_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_ticket_id_fkey` FOREIGN KEY (`ticket_id`) REFERENCES `tickets`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_organization_id_fkey` FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
