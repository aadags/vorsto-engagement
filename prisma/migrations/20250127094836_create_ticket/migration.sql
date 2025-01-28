-- CreateTable
CREATE TABLE `tickets` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `priority` VARCHAR(191) NOT NULL,
    `description` LONGTEXT NULL,
    `conversation_id` VARCHAR(191) NULL,
    `call_id` VARCHAR(191) NULL,
    `user_id` INTEGER NULL,
    `organization_id` INTEGER NOT NULL,

    UNIQUE INDEX `tickets_conversation_id_key`(`conversation_id`),
    UNIQUE INDEX `tickets_call_id_key`(`call_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tickets` ADD CONSTRAINT `tickets_conversation_id_fkey` FOREIGN KEY (`conversation_id`) REFERENCES `conversations`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tickets` ADD CONSTRAINT `tickets_call_id_fkey` FOREIGN KEY (`call_id`) REFERENCES `calls`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tickets` ADD CONSTRAINT `tickets_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tickets` ADD CONSTRAINT `tickets_organization_id_fkey` FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
