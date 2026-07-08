"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { ADMIN_SESSION_COOKIE, isValidAdminSession } from "@/lib/adminAuth";

async function assertAdmin() {
  const store = await cookies();
  if (!isValidAdminSession(store.get(ADMIN_SESSION_COOKIE)?.value)) {
    throw new Error("Not authorized");
  }
}

export async function updateFacility(formData: FormData) {
  await assertAdmin();

  const id = String(formData.get("id"));
  const tier = formData.get("tier") === "FEATURED" ? "FEATURED" : "FREE";
  const status = formData.get("status") === "PENDING" ? "PENDING" : "PUBLISHED";
  const verified = formData.get("verified") === "on";
  const photosUnlocked = formData.get("photosUnlocked") === "on";
  const leadDeliveryOn = formData.get("leadDeliveryOn") === "on";

  await prisma.facility.update({
    where: { id },
    data: { tier, status, verified, photosUnlocked, leadDeliveryOn },
  });

  revalidatePath("/admin");
}
