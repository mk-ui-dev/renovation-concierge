import Header from '@/components/Header';
import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: {
      client: true,
      milestones: {
        orderBy: { order: 'asc' },
      },
      defects: {
        orderBy: { reportedDate: 'desc' },
      },
      siteVisits: {
        orderBy: { visitDate: 'desc' },
        include: { inspector: true },
      },
      deliveries: {
        orderBy: { expectedDate: 'asc' },
      },
      reports: {
        orderBy: { generatedAt: 'desc' },
      },
    },
  });

  if (!project) {
    notFound();
  }

  const completedMilestones = project.milestones.filter((m) => m.status === 'completed').length;
  const progressPercent = project.milestones.length > 0
    ? Math.round((completedMilestones / project.milestones.length) * 100)
    : 0;

  return (
    <div>
      <Header title={project.name} description={project.address} />

      <div className="p-6">
        {/* Project Info */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Client</h3>
              <p className="mt-1 text-lg font-medium text-gray-900">{project.client.name}</p>
              <p className="text-sm text-gray-600">{project.client.email}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Package</h3>
              <p className="mt-1">
                <span className="px-3 py-1 text-sm font-medium bg-purple-100 text-purple-800 rounded">
                  {project.package.toUpperCase()}
                </span>
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Status</h3>
              <p className="mt-1">
                <span
                  className={`px-3 py-1 text-sm font-medium rounded ${
                    project.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : project.status === 'in_progress'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {project.status.replace('_', ' ').toUpperCase()}
                </span>
              </p>
            </div>
          </div>

          {project.description && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-500">Description</h3>
              <p className="mt-1 text-gray-900">{project.description}</p>
            </div>
          )}

          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-gray-500">Progress</h3>
              <span className="text-sm font-medium text-gray-900">{progressPercent}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Milestones */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Milestones</h2>
          </div>
          <div className="p-6">
            {project.milestones.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No milestones yet</p>
            ) : (
              <div className="space-y-4">
                {project.milestones.map((milestone, idx) => (
                  <div key={milestone.id} className="flex items-start">
                    <div className="flex-shrink-0">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                          milestone.status === 'completed'
                            ? 'bg-green-500'
                            : milestone.status === 'in_progress'
                            ? 'bg-blue-500'
                            : 'bg-gray-300'
                        }`}
                      >
                        {idx + 1}
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{milestone.title}</h3>
                          {milestone.description && (
                            <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                          )}
                        </div>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded ${
                            milestone.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : milestone.status === 'in_progress'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {milestone.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Due: {new Date(milestone.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Defects */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Defects</h2>
            </div>
            <div className="p-6">
              {project.defects.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No defects reported</p>
              ) : (
                <div className="space-y-3">
                  {project.defects.slice(0, 5).map((defect) => (
                    <div key={defect.id} className="border border-gray-200 rounded p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-sm text-gray-900">{defect.title}</h3>
                          <p className="text-xs text-gray-600 mt-1">{defect.location}</p>
                        </div>
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
                  ))}
                </div>
              )}
              {project.defects.length > 5 && (
                <Link
                  href="/dashboard/defects"
                  className="block text-center text-blue-600 hover:text-blue-700 text-sm mt-4"
                >
                  View all defects
                </Link>
              )}
            </div>
          </div>

          {/* Site Visits */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Site Visits</h2>
            </div>
            <div className="p-6">
              {project.siteVisits.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No site visits recorded</p>
              ) : (
                <div className="space-y-3">
                  {project.siteVisits.slice(0, 5).map((visit) => (
                    <div key={visit.id} className="border border-gray-200 rounded p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-sm text-gray-900">
                            {new Date(visit.visitDate).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">By: {visit.inspector.name}</p>
                          {visit.notes && (
                            <p className="text-xs text-gray-700 mt-2 line-clamp-2">{visit.notes}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {project.siteVisits.length > 5 && (
                <Link
                  href="/dashboard/visits"
                  className="block text-center text-blue-600 hover:text-blue-700 text-sm mt-4"
                >
                  View all visits
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Deliveries */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Deliveries</h2>
          </div>
          <div className="p-6">
            {project.deliveries.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No deliveries tracked</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left text-xs font-medium text-gray-500 uppercase py-2">Item</th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase py-2">Supplier</th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase py-2">Expected</th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {project.deliveries.map((delivery) => (
                      <tr key={delivery.id} className="border-b">
                        <td className="py-2 text-sm text-gray-900">{delivery.itemName}</td>
                        <td className="py-2 text-sm text-gray-600">{delivery.supplier || '-'}</td>
                        <td className="py-2 text-sm text-gray-600">
                          {new Date(delivery.expectedDate).toLocaleDateString()}
                        </td>
                        <td className="py-2">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded ${
                              delivery.status === 'delivered'
                                ? 'bg-green-100 text-green-800'
                                : delivery.status === 'delayed'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {delivery.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
