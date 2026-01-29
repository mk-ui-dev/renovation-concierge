import Header from '@/components/Header';
import { prisma } from '@/lib/db';

export default async function SiteVisitsPage() {
  const visits = await prisma.siteVisit.findMany({
    include: {
      project: true,
      inspector: true,
    },
    orderBy: { visitDate: 'desc' },
  });

  return (
    <div>
      <Header title="Site Visits" description="Inspection and site visit records" />

      <div className="p-6">
        <div className="bg-white rounded-lg shadow">
          <div className="divide-y divide-gray-200">
            {visits.length === 0 ? (
              <p className="text-center text-gray-500 py-12">No site visits recorded</p>
            ) : (
              visits.map((visit) => (
                <div key={visit.id} className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {new Date(visit.visitDate).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        🏠 {visit.project.name} • 👤 Inspected by {visit.inspector.name}
                      </p>
                      {visit.notes && (
                        <div className="bg-gray-50 rounded p-4">
                          <p className="text-sm text-gray-700">{visit.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
