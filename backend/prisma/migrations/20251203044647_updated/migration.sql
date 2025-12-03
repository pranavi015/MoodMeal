/*
  Warnings:

  - You are about to alter the column `foods` on the `UserMeal` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Json`.

*/
-- AlterTable
ALTER TABLE `UserMeal` MODIFY `foods` JSON NOT NULL;
