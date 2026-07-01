-- AlterTable
ALTER TABLE "ContactMessage" ADD COLUMN "phone" TEXT;

-- CreateTable
CREATE TABLE "AtaturkSetting" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'singleton',
    "heroImage" TEXT,
    "gallery" TEXT,
    "songs" TEXT,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Announcement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" TEXT,
    "featuredImage" TEXT,
    "images" TEXT DEFAULT '[]',
    "category" TEXT NOT NULL DEFAULT 'Duyuru',
    "author" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "views" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Announcement" ("author", "category", "content", "createdAt", "date", "excerpt", "featuredImage", "id", "published", "title", "updatedAt") SELECT "author", "category", "content", "createdAt", "date", "excerpt", "featuredImage", "id", "published", "title", "updatedAt" FROM "Announcement";
DROP TABLE "Announcement";
ALTER TABLE "new_Announcement" RENAME TO "Announcement";
CREATE TABLE "new_BoardMember" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "image" TEXT,
    "bio" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "type" TEXT NOT NULL DEFAULT 'birim',
    "status" TEXT NOT NULL DEFAULT 'asil',
    "parentId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "BoardMember_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "BoardMember" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);
INSERT INTO "new_BoardMember" ("bio", "createdAt", "id", "image", "name", "order", "role", "updatedAt") SELECT "bio", "createdAt", "id", "image", "name", "order", "role", "updatedAt" FROM "BoardMember";
DROP TABLE "BoardMember";
ALTER TABLE "new_BoardMember" RENAME TO "BoardMember";
CREATE TABLE "new_Page" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "heroImage" TEXT,
    "images" TEXT,
    "panoramaImage" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Page" ("content", "createdAt", "heroImage", "id", "published", "slug", "title", "updatedAt") SELECT "content", "createdAt", "heroImage", "id", "published", "slug", "title", "updatedAt" FROM "Page";
DROP TABLE "Page";
ALTER TABLE "new_Page" RENAME TO "Page";
CREATE UNIQUE INDEX "Page_slug_key" ON "Page"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

