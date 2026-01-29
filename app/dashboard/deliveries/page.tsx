import Header from '@/components/Header';
import { prisma } from '@/lib/db';

export default async function DeliveriesPage() {
  const deliveries = await prisma.delivery.findMany({
    include: { project: true },
    orderBy: { expectedDate: 'asc' },
  });

  const pending = deliveries.filter((d) => d.status === 'pending');
  const delivered = deliveries.filter((d) => d.status === 'delivered');
  const delayed = deliveries.filter((d) => d.status === 'delayed');

  return (
    <div>
      <Header title="Deliveries" description="Track material and furniture deliveries" />

      <div className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm font-medium text-gray-600">Pending</div>
            <div className="text-2xl font-bold text-yellow-600 mt-1">{pending.length}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm font-medium text-gray-600">Delivered</div>
            <div className="text-2xl font-bold text-green-600 mt-1">{delivered.length}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm font-medium text-gray-600">Delayed</div>
            <div className="text-2xl font-bold text-red-600 mt-1">{delayed.length}</div>
          </div>
        </div>

        {/* Deliveries Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expected Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Delivered Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {deliveries.map((delivery) => (
                <tr key={delivery.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{delivery.itemName}</div>
                    {delivery.notes && (
                      <div className="text-sm text-gray-500 mt-1">{delivery.notes}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{delivery.project.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{delivery.supplier || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {new Date(delivery.expectedDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {delivery.deliveredDate
                      ? new Date(delivery.deliveredDate).toLocaleDateString()
                      : '-'}
                  </td>
                  <td className="px-6 py-4">
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
      </div>
    </div>
  );
}
