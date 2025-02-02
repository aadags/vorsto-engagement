/*
  Warnings:

  - A unique constraint covering the columns `[organization_id,email]` on the table `contacts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[organization_id,phone]` on the table `contacts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[organization_id,username]` on the table `contacts` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `contacts_email_key` ON `contacts`;

-- DropIndex
DROP INDEX `contacts_phone_key` ON `contacts`;

-- DropIndex
DROP INDEX `contacts_username_key` ON `contacts`;

-- CreateIndex
CREATE UNIQUE INDEX `contacts_organization_id_email_key` ON `contacts`(`organization_id`, `email`);

-- CreateIndex
CREATE UNIQUE INDEX `contacts_organization_id_phone_key` ON `contacts`(`organization_id`, `phone`);

-- CreateIndex
CREATE UNIQUE INDEX `contacts_organization_id_username_key` ON `contacts`(`organization_id`, `username`);
