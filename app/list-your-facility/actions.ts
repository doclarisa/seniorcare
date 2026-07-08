"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import { COUNTIES, CARE_LEVEL_FILTERS } from "@/lib/facilities";

const schema = z.object({
  name: z.string().min(2),
  address: z.string().optional(),
  city: z.string().min(1),
  zip: z.string().optional(),
  county: z.enum(COUNTIES),
  phone: z.string().optional(),
  website: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  careLevels: z.array(z.string()).default([]),
  medicaidAccepted: z.boolean().default(false),
  summary: z.string().max(1000).optional(),
});

export type ListFacilityState = { ok: boolean; error?: string };

export async function submitFacility(
  _prev: ListFacilityState,
  formData: FormData,
): Promise<ListFacilityState> {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    address: formData.get("address") || undefined,
    city: formData.get("city"),
    zip: formData.get("zip") || undefined,
    county: formData.get("county"),
    phone: formData.get("phone") || undefined,
    website: formData.get("website") || undefined,
    email: formData.get("email") || "",
    careLevels: formData.getAll("careLevels").map(String),
    medicaidAccepted: formData.get("medicaidAccepted") === "on",
    summary: formData.get("summary") || undefined,
  });

  if (!parsed.success) {
    return { ok: false, error: "Please check the required fields (name, city, and county)." };
  }

  const data = parsed.data;
  const validCareLevels = new Set(CARE_LEVEL_FILTERS.map((c) => c.value));
  const careLevels = data.careLevels.filter((c) => validCareLevels.has(c as (typeof CARE_LEVEL_FILTERS)[number]["value"]));

  let slug = slugify(data.name);
  let suffix = 1;
  while (await prisma.facility.findUnique({ where: { slug } })) {
    suffix += 1;
    slug = `${slugify(data.name)}-${suffix}`;
  }

  await prisma.facility.create({
    data: {
      name: data.name,
      slug,
      address: data.address ?? null,
      city: data.city,
      zip: data.zip ?? null,
      county: data.county,
      phone: data.phone ?? null,
      website: data.website ?? null,
      email: data.email || null,
      careLevels,
      medicaidAccepted: data.medicaidAccepted,
      summary: data.summary ?? null,
      status: "PENDING",
      tier: "FREE",
    },
  });

  return { ok: true };
}
