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
    "photosUnlocked" BOOLEAN NOT NULL DEFAULT false,
    "leadDeliveryOn" BOOLEAN NOT NULL DEFAULT false,
    "photos" JSONB,
    "status" TEXT NOT NULL DEFAULT 'PUBLISHED',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Facility" ("address", "amenities", "awards", "capacity", "capacityNote", "careLevels", "city", "county", "createdAt", "email", "flags", "id", "lat", "license", "licenseVerified", "lng", "medicaidAccepted", "name", "operator", "phone", "photos", "priceEstimate", "priceMin", "priceNote", "qualityTier", "roomTypes", "slug", "status", "summary", "tier", "updatedAt", "verified", "website", "yearOpened", "zip") SELECT "address", "amenities", "awards", "capacity", "capacityNote", "careLevels", "city", "county", "createdAt", "email", "flags", "id", "lat", "license", "licenseVerified", "lng", "medicaidAccepted", "name", "operator", "phone", "photos", "priceEstimate", "priceMin", "priceNote", "qualityTier", "roomTypes", "slug", "status", "summary", "tier", "updatedAt", "verified", "website", "yearOpened", "zip" FROM "Facility";
DROP TABLE "Facility";
ALTER TABLE "new_Facility" RENAME TO "Facility";
CREATE UNIQUE INDEX "Facility_slug_key" ON "Facility"("slug");
CREATE INDEX "Facility_county_idx" ON "Facility"("county");
CREATE INDEX "Facility_tier_idx" ON "Facility"("tier");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
