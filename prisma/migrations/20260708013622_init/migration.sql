-- CreateTable
CREATE TABLE "Facility" (
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
    "licenseType" TEXT,
    "licenseStatus" TEXT,
    "licenseNumber" TEXT,
    "licenseExpires" TEXT,
    "licenseOperator" TEXT,
    "licenseVerified" BOOLEAN NOT NULL DEFAULT false,
    "capacity" INTEGER,
    "priceMin" INTEGER,
    "priceNote" TEXT,
    "medicaidAccepted" BOOLEAN NOT NULL DEFAULT false,
    "roomTypes" JSONB,
    "amenities" JSONB,
    "awards" JSONB,
    "yearOpened" INTEGER,
    "operator" TEXT,
    "summary" TEXT,
    "flags" TEXT,
    "tier" TEXT NOT NULL DEFAULT 'FREE',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "photos" JSONB,
    "status" TEXT NOT NULL DEFAULT 'PUBLISHED',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "facilityId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "score" REAL,
    "count" INTEGER,
    "note" TEXT,
    CONSTRAINT "Review_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "facilityId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "message" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Lead_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Facility_slug_key" ON "Facility"("slug");

-- CreateIndex
CREATE INDEX "Facility_county_idx" ON "Facility"("county");

-- CreateIndex
CREATE INDEX "Facility_tier_idx" ON "Facility"("tier");

-- CreateIndex
CREATE INDEX "Review_facilityId_idx" ON "Review"("facilityId");

-- CreateIndex
CREATE INDEX "Lead_facilityId_idx" ON "Lead"("facilityId");
