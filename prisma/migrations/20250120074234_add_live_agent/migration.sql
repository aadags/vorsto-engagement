-- CreateTable
CREATE TABLE `live_call_agents` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` INTEGER NOT NULL,

    UNIQUE INDEX `live_call_agents_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
