/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "createdAt",
ALTER COLUMN "status" SET DEFAULT false;
