/*
  Warnings:

  - A unique constraint covering the columns `[reference]` on the table `paystacks` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `paystacks_reference_key` ON `paystacks`(`reference`);
