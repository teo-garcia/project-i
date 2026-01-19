/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Assignee` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Assignee_name_key" ON "Assignee"("name");
