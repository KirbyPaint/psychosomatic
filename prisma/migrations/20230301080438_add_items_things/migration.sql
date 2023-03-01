/*
  Warnings:

  - The primary key for the `Item` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `name` on the `Item` table. All the data in the column will be lost.
  - Added the required column `action` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rarity` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stat` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Player" ADD COLUMN "equippedItem" TEXT;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Item" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "action" TEXT NOT NULL,
    "attribute" TEXT,
    "description" TEXT NOT NULL,
    "rarity" TEXT NOT NULL,
    "stat" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "ownerId" TEXT,
    CONSTRAINT "Item_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Player" ("discordId") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Item" ("createdAt", "description", "id", "ownerId", "updatedAt") SELECT "createdAt", "description", "id", "ownerId", "updatedAt" FROM "Item";
DROP TABLE "Item";
ALTER TABLE "new_Item" RENAME TO "Item";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
