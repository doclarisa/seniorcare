-- CreateEnum
CREATE TYPE "Tier" AS ENUM ('FREE', 'FEATURED');

-- CreateEnum
CREATE TYPE "ListingStatus" AS ENUM ('PUBLISHED', 'PENDING');

-- CreateTable
CREATE TABLE "Facility" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "address" TEXT,
    "city" TEXT NOT NULL,
    "zip" TEXT,
    "county" TEXT NOT NULL,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
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
    "tier" "Tier" NOT NULL DEFAULT 'FREE',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "photosUnlocked" BOOLEAN NOT NULL DEFAULT false,
    "leadDeliveryOn" BOOLEAN NOT NULL DEFAULT false,
    "photos" JSONB,
    "status" "ListingStatus" NOT NULL DEFAULT 'PUBLISHED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Facility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "facilityId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "score" DOUBLE PRECISION,
    "count" INTEGER,
    "note" TEXT,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "facilityId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
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

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility"("id") ON DELETE CASCADE ON UPDATE CASCADE;
