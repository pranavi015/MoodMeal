/*
  Warnings:

  - You are about to drop the `CravingSwap` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `CravingSwap` DROP FOREIGN KEY `CravingSwap_userId_fkey`;

-- DropTable
DROP TABLE `CravingSwap`;

-- CreateTable
CREATE TABLE `CravingSwaps` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `cravingType` VARCHAR(191) NOT NULL,
    `originalItem` TEXT NOT NULL,
    `suggestedSwap` TEXT NULL,
    `accepted` BOOLEAN NOT NULL DEFAULT false,
    `satisfactionRating` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `completedAt` DATETIME(3) NULL,

    INDEX `CravingSwaps_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CravingSwaps` ADD CONSTRAINT `CravingSwaps_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
