import prisma from "@/lib/prisma";
import { markEnquiryStatus } from "@/lib/actions/enquiries";
import { Mail, Phone } from "lucide-react";

export const dynamic = "force-dynamic";

const STATUS_STYLES: Record<string, string> = {
  NEW: "bg-yellow-100 text-yellow-800",
  READ: "bg-blue-100 text-blue-800",
  RESOLVED: "bg-green-100 text-green-800",
};

export default async function AdminEnquiriesPage() {
  const enquiries = await prisma.contactEnquiry.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Contact Enquiries</h1>

      {enquiries.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center text-gray-500">
          No enquiries yet. Submissions from the Contact page will appear here.
        </div>
      ) : (
        <div className="space-y-4">
          {enquiries.map((enquiry) => (
            <div key={enquiry.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-gray-900">{enquiry.name}</h3>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[enquiry.status]}`}>
                      {enquiry.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <span className="flex items-center gap-1"><Phone size={14} /> {enquiry.phone}</span>
                    {enquiry.email && <span className="flex items-center gap-1"><Mail size={14} /> {enquiry.email}</span>}
                    <span>{enquiry.createdAt.toLocaleString("en-IN")}</span>
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{enquiry.message}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  {enquiry.status !== "READ" && (
                    <form action={markEnquiryStatus.bind(null, enquiry.id, "READ")}>
                      <button type="submit" className="text-xs font-medium px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors">
                        Mark Read
                      </button>
                    </form>
                  )}
                  {enquiry.status !== "RESOLVED" && (
                    <form action={markEnquiryStatus.bind(null, enquiry.id, "RESOLVED")}>
                      <button type="submit" className="text-xs font-medium px-3 py-1.5 rounded-md border border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white transition-colors">
                        Mark Resolved
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
