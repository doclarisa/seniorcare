/*
  Warnings:

  - You are about to drop the column `licenseExpires` on the `Facility` table. All the data in the column will be lost.
  - You are about to drop the column `licenseNumber` on the `Facility` table. All the data in the column will be lost.
  - You are about to drop the column `licenseOperator` on the `Facility` table. All the data in the column will be lost.
  - You are about to drop the column `licenseStatus` on the `Facility` table. All the data in the column will be lost.
  - You are about to drop the column `licenseType` on the `Facility` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Facility" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "address" TEXT,
    "city" TEXT NOT NULL,
    "zip" TEXT,
    "county" TEXT NOT NULL,
    "lat" REAL,
    "lng" REAL,
    "phone" TEXT,
    "website" TEXT,
    "email" TEXT,
    "careLevels" JSONB NOT NULL,
    "license" TEXT,
    "licenseVerified" BOOLEAN NOT NULL DEFAULT false,
    "capacity" INTEGER,
    "capacityNote" TEXT,
    "priceMin" INTEGER,
    "priceNote" TEXT,
    "priceEstimate" BOOLEAN NOT NULL DEFAULT true,
    "medicaidAccepted" BOOLEAN NOT NULL DEFAULT false,
    "roomTypes" JSONB,
    "amenities" JSONB,
    "awards" JSONB,
    "yearOpened" INTEGER,
    "operator" TEXT,
    "summary" TEXT,
    "flags" TEXT,
    "qualityTier" TEXT,
    "tier" TEXT NOT NULL DEFAULT 'FREE',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "photos" JSONB,
    "status" TEXT NOT NULL DEFAULT 'PUBLISHED',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Facility" ("address", "amenities", "awards", "capacity", "careLevels", "city", "county", "createdAt", "email", "flags", "id", "lat", "licenseVerified", "lng", "medicaidAccepted", "name", "operator", "phone", "photos", "priceMin", "priceNote", "roomTypes", "slug", "status", "summary", "tier", "updatedAt", "verified", "website", "yearOpened", "zip") SELECT "address", "amenities", "awards", "capacity", "careLevels", "city", "county", "createdAt", "email", "flags", "id", "lat", "licenseVerified", "lng", "medicaidAccepted", "name", "operator", "phone", "photos", "priceMin", "priceNote", "roomTypes", "slug", "status", "summary", "tier", "updatedAt", "verified", "website", "yearOpened", "zip" FROM "Facility";
DROP TABLE "Facility";
ALTER TABLE "new_Facility" RENAME TO "Facility";
CREATE UNIQUE INDEX "Facility_slug_key" ON "Facility"("slug");
CREATE INDEX "Facility_county_idx" ON "Facility"("county");
CREATE INDEX "Facility_tier_idx" ON "Facility"("tier");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
