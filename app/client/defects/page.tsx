import Header from '@/components/Header';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';

export default async function ClientDefectsPage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const defects = await prisma.defect.findMany({
    where: {
      project: {
        clientId: user.id,
      },
    },
    include: { project: true },
    orderBy: { reportedDate: 'desc' },
  });

  return (
    <div>
      <Header title="Defects & Issues" description="Track reported issues and their status" />

      <div className="p-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            {defects.length === 0 ? (
              <p className="text-center text-gray-500 py-12">No defects reported</p>
            ) : (
              <div className="space-y-4">
                {defects.map((defect) => (
                  <div key={defect.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{defect.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{defect.description}</p>
                      </div>
                      <div className="flex gap-2">
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
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>🏠 {defect.project.name}</span>
                      <span>📍 {defect.location}</span>
                      <span>📅 {new Date(defect.reportedDate).toLocaleDateString()}</span>
                      {defect.fixedDate && (
                        <span>✅ Fixed: {new Date(defect.fixedDate).toLocaleDateString()}</span>
                      )}
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
