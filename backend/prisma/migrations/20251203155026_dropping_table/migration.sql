/*
  Warnings:

  - You are about to drop the `CravingSwaps` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `CravingSwaps` DROP FOREIGN KEY `CravingSwaps_userId_fkey`;

-- DropTable
DROP TABLE `CravingSwaps`;
