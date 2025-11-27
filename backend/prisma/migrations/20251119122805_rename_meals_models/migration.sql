/*
  Warnings:

  - You are about to drop the column `mealId` on the `MoodLog` table. All the data in the column will be lost.
  - You are about to drop the `Meal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Meals` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Meal` DROP FOREIGN KEY `Meal_userId_fkey`;

-- DropForeignKey
ALTER TABLE `MoodLog` DROP FOREIGN KEY `MoodLog_mealId_fkey`;

-- DropIndex
DROP INDEX `MoodLog_mealId_fkey` ON `MoodLog`;

-- AlterTable
ALTER TABLE `MoodLog` DROP COLUMN `mealId`,
    ADD COLUMN `userMealId` INTEGER NULL;

-- DropTable
DROP TABLE `Meal`;

-- DropTable
DROP TABLE `Meals`;

-- CreateTable
CREATE TABLE `UserMeal` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `mealType` VARCHAR(191) NOT NULL,
    `foods` TEXT NOT NULL,
    `photo` VARCHAR(191) NULL,
    `moodBefore` VARCHAR(191) NULL,
    `moodAfter` VARCHAR(191) NULL,
    `cravings` TEXT NULL,
    `notes` TEXT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `UserMeal_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CuratedMeal` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `imageUrl` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserMeal` ADD CONSTRAINT `UserMeal_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MoodLog` ADD CONSTRAINT `MoodLog_userMealId_fkey` FOREIGN KEY (`userMealId`) REFERENCES `UserMeal`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
