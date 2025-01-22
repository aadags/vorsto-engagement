-- CreateTable
CREATE TABLE `call_logs` (
    `id` VARCHAR(191) NOT NULL,
    `transcript` LONGTEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
