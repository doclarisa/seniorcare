import { Container } from "@/components/Container";
import { prisma } from "@/lib/prisma";
import { updateFacility } from "./actions";

export const metadata = { title: "Admin dashboard" };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [facilities, leads] = await Promise.all([
    prisma.facility.findMany({ orderBy: { name: "asc" } }),
    prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 25,
      include: { facility: true },
    }),
  ]);

  const paymentsEnabled = process.env.PAYMENTS_ENABLED === "true";
  const pendingCount = facilities.filter((f) => f.status === "PENDING").length;

  return (
    <Container className="py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-900">Admin dashboard</h1>
        <form action="/api/admin/logout" method="post">
          <button className="text-sm font-medium text-slate-500 underline">Log out</button>
        </form>
      </div>

      <p className="mt-2 text-sm text-slate-600">
        Payments are{" "}
        <span className={paymentsEnabled ? "font-semibold text-emerald-700" : "font-semibold text-amber-700"}>
          {paymentsEnabled ? "enabled" : "dormant"}
        </span>
        . While dormant, toggle Tier / Verified / Photos / Lead delivery below to simulate an
        upgrade. {pendingCount > 0 && `${pendingCount} listing(s) pending review.`}
      </p>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="py-2 pr-3">Facility</th>
              <th className="py-2 pr-3">County</th>
              <th className="py-2 pr-3">Manage</th>
            </tr>
          </thead>
          <tbody>
            {facilities.map((f) => (
              <tr key={f.id} className="border-b border-slate-100 align-top">
                <td className="py-3 pr-3 font-medium text-slate-800">
                  {f.name}
                  {f.status === "PENDING" && (
                    <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
                      Pending
                    </span>
                  )}
                </td>
                <td className="py-3 pr-3 text-slate-600">{f.county}</td>
                <td className="py-3 pr-3">
                  <form action={updateFacility} className="flex flex-wrap items-center gap-3">
                    <input type="hidden" name="id" value={f.id} />
                    <select
                      name="status"
                      defaultValue={f.status}
                      className="min-h-9 rounded border border-slate-300 px-1 text-sm"
                    >
                      <option value="PUBLISHED">Published</option>
                      <option value="PENDING">Pending</option>
                    </select>
                    <select
                      name="tier"
                      defaultValue={f.tier}
                      className="min-h-9 rounded border border-slate-300 px-1 text-sm"
                    >
                      <option value="FREE">Free</option>
                      <option value="FEATURED">Featured</option>
                    </select>
                    <label className="flex items-center gap-1 text-slate-700">
                      <input type="checkbox" name="verified" defaultChecked={f.verified} /> Verified
                    </label>
                    <label className="flex items-center gap-1 text-slate-700">
                      <input type="checkbox" name="photosUnlocked" defaultChecked={f.photosUnlocked} /> Photos
                    </label>
                    <label className="flex items-center gap-1 text-slate-700">
                      <input type="checkbox" name="leadDeliveryOn" defaultChecked={f.leadDeliveryOn} /> Lead
                      delivery
                    </label>
                    <button
                      type="submit"
                      className="min-h-9 rounded bg-teal-800 px-3 text-sm font-semibold text-white"
                    >
                      Save
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-10 text-lg font-bold text-slate-900">Recent inquiries</h2>
      <div className="mt-4 space-y-3">
        {leads.length === 0 && <p className="text-sm text-slate-500">No inquiries yet.</p>}
        {leads.map((lead) => (
          <div key={lead.id} className="rounded-lg border border-slate-200 p-3 text-sm">
            <p className="font-semibold text-slate-800">
              {lead.name} &rarr; {lead.facility.name}
            </p>
            <p className="text-slate-600">
              {lead.email}
              {lead.phone ? ` · ${lead.phone}` : ""} · {lead.createdAt.toLocaleString()}
            </p>
            {lead.message && <p className="mt-1 text-slate-700">{lead.message}</p>}
          </div>
        ))}
      </div>
    </Container>
  );
}
