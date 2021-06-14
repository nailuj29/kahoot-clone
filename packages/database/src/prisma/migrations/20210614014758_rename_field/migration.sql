/*
  Warnings:

  - You are about to drop the column `userId` on the `Quiz` table. All the data in the column will be lost.
  - Added the required column `authorId` to the `Quiz` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Quiz" DROP CONSTRAINT "Quiz_userId_fkey";

-- AlterTable
ALTER TABLE "Quiz" RENAME COLUMN "userId" to "authorId";
