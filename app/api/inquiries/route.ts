import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendLeadEmail } from "@/lib/email";

const schema = z.object({
  facilityId: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please fill in your name and a valid email." }, { status: 400 });
  }
  const { facilityId, name, email, phone, message } = parsed.data;

  const facility = await prisma.facility.findUnique({ where: { id: facilityId } });
  if (!facility) {
    return NextResponse.json({ error: "Facility not found." }, { status: 404 });
  }

  await prisma.lead.create({
    data: { facilityId, name, email, phone, message },
  });

  if (facility.leadDeliveryOn && facility.email) {
    await sendLeadEmail({
      to: facility.email,
      facilityName: facility.name,
      name,
      email,
      phone,
      message,
    });
  }

  return NextResponse.json({ ok: true });
}
