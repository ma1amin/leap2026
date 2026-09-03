-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "nameAr" TEXT,
    "description" TEXT NOT NULL,
    "descriptionAr" TEXT,
    "website" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "linkedin" TEXT,
    "twitter" TEXT,
    "instagram" TEXT,
    "booth" TEXT,
    "hall" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
