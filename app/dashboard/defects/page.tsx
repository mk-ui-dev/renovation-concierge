import Header from '@/components/Header';
import { prisma } from '@/lib/db';

export default async function DefectsPage() {
  const defects = await prisma.defect.findMany({
    include: { project: true },
    orderBy: { reportedDate: 'desc' },
  });

  return (
    <div>
      <Header title="Defects" description="Track and manage renovation defects" />

      <div className="p-6">
        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button className="border-b-2 border-blue-500 py-4 px-1 text-sm font-medium text-blue-600">
                All ({defects.length})
              </button>
              <button className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700">
                Open ({defects.filter((d) => d.status === 'open').length})
              </button>
              <button className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700">
                Fixed ({defects.filter((d) => d.status === 'fixed').length})
              </button>
              <button className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700">
                Approved ({defects.filter((d) => d.status === 'approved').length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {defects.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No defects found</p>
            ) : (
              <div className="space-y-4">
                {defects.map((defect) => (
                  <div key={defect.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">{defect.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{defect.description}</p>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded ${
                                defect.severity === 'high'
                                  ? 'bg-red-100 text-red-800'
                                  : defect.severity === 'medium'
                                  ? 'bg-orange-100 text-orange-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {defect.severity}
                            </span>
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded ${
                                defect.status === 'approved'
                                  ? 'bg-green-100 text-green-800'
                                  : defect.status === 'fixed'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-orange-100 text-orange-800'
                              }`}
                            >
                              {defect.status}
                            </span>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
                          <span>🏠 {defect.project.name}</span>
                          <span>📍 {defect.location}</span>
                          <span>📅 Reported: {new Date(defect.reportedDate).toLocaleDateString()}</span>
                          {defect.fixedDate && (
                            <span>✅ Fixed: {new Date(defect.fixedDate).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
