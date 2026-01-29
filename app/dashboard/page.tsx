import Header from '@/components/Header';
import { prisma } from '@/lib/db';
import Link from 'next/link';

export default async function DashboardPage() {
  const [projects, defects, upcomingDeliveries] = await Promise.all([
    prisma.project.findMany({
      include: { client: true },
      orderBy: { updatedAt: 'desc' },
      take: 5,
    }),
    prisma.defect.findMany({
      where: { status: 'open' },
      include: { project: true },
      orderBy: { reportedDate: 'desc' },
      take: 5,
    }),
    prisma.delivery.findMany({
      where: { status: 'pending' },
      include: { project: true },
      orderBy: { expectedDate: 'asc' },
      take: 5,
    }),
  ]);

  const stats = {
    totalProjects: await prisma.project.count(),
    activeProjects: await prisma.project.count({ where: { status: 'in_progress' } }),
    openDefects: await prisma.defect.count({ where: { status: 'open' } }),
    pendingDeliveries: await prisma.delivery.count({ where: { status: 'pending' } }),
  };

  return (
    <div>
      <Header title="Dashboard" description="Overview of all renovation projects" />

      <div className="p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm font-medium text-gray-600">Total Projects</div>
            <div className="text-3xl font-bold text-gray-900 mt-2">{stats.totalProjects}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm font-medium text-gray-600">Active Projects</div>
            <div className="text-3xl font-bold text-blue-600 mt-2">{stats.activeProjects}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm font-medium text-gray-600">Open Defects</div>
            <div className="text-3xl font-bold text-orange-600 mt-2">{stats.openDefects}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm font-medium text-gray-600">Pending Deliveries</div>
            <div className="text-3xl font-bold text-green-600 mt-2">{stats.pendingDeliveries}</div>
          </div>
        </div>

        {/* Recent Projects */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Recent Projects</h2>
            <Link href="/dashboard/projects" className="text-blue-600 hover:text-blue-700 text-sm">
              View all
            </Link>
          </div>
          <div className="divide-y">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/dashboard/projects/${project.id}`}
                className="block px-6 py-4 hover:bg-gray-50"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">{project.name}</h3>
                    <p className="text-sm text-gray-600">{project.address}</p>
                    <p className="text-xs text-gray-500 mt-1">Client: {project.client.name}</p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded ${
                      project.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : project.status === 'in_progress'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {project.status.replace('_', ' ')}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Open Defects */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold">Open Defects</h2>
              <Link href="/dashboard/defects" className="text-blue-600 hover:text-blue-700 text-sm">
                View all
              </Link>
            </div>
            <div className="divide-y">
              {defects.length === 0 ? (
                <p className="px-6 py-4 text-gray-500 text-sm">No open defects</p>
              ) : (
                defects.map((defect) => (
                  <div key={defect.id} className="px-6 py-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900 text-sm">{defect.title}</h3>
                        <p className="text-xs text-gray-600 mt-1">{defect.project.name}</p>
                        <p className="text-xs text-gray-500">{defect.location}</p>
                      </div>
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
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Upcoming Deliveries */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold">Upcoming Deliveries</h2>
              <Link href="/dashboard/deliveries" className="text-blue-600 hover:text-blue-700 text-sm">
                View all
              </Link>
            </div>
            <div className="divide-y">
              {upcomingDeliveries.length === 0 ? (
                <p className="px-6 py-4 text-gray-500 text-sm">No pending deliveries</p>
              ) : (
                upcomingDeliveries.map((delivery) => (
                  <div key={delivery.id} className="px-6 py-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900 text-sm">{delivery.itemName}</h3>
                        <p className="text-xs text-gray-600 mt-1">{delivery.project.name}</p>
                        {delivery.supplier && (
                          <p className="text-xs text-gray-500">Supplier: {delivery.supplier}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-600">
                          {new Date(delivery.expectedDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
