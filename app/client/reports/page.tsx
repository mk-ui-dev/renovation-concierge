import Header from '@/components/Header';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';

export default async function ClientReportsPage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const reports = await prisma.report.findMany({
    where: {
      project: {
        clientId: user.id,
      },
    },
    include: { project: true },
    orderBy: { generatedAt: 'desc' },
  });

  return (
    <div>
      <Header title="Reports" description="Project progress and inspection reports" />

      <div className="p-6">
        {reports.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500">No reports available yet</p>
          </div>
        ) : (
          <div className="space-y-6">
            {reports.map((report) => {
              let content;
              try {
                content = JSON.parse(report.content);
              } catch {
                content = { summary: report.content };
              }

              return (
                <div key={report.id} className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">{report.title}</h2>
                        <p className="text-sm text-gray-600 mt-1">
                          {report.project.name} •{' '}
                          {new Date(report.generatedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                        {report.reportType}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    {content.summary && (
                      <div className="mb-4">
                        <h3 className="font-medium text-gray-900 mb-2">Summary</h3>
                        <p className="text-gray-700">{content.summary}</p>
                      </div>
                    )}

                    {content.completedTasks && content.completedTasks.length > 0 && (
                      <div className="mb-4">
                        <h3 className="font-medium text-gray-900 mb-2">Completed</h3>
                        <ul className="list-disc list-inside space-y-1">
                          {content.completedTasks.map((task: string, idx: number) => (
                            <li key={idx} className="text-gray-700">
                              {task}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {content.upcomingTasks && content.upcomingTasks.length > 0 && (
                      <div className="mb-4">
                        <h3 className="font-medium text-gray-900 mb-2">Upcoming</h3>
                        <ul className="list-disc list-inside space-y-1">
                          {content.upcomingTasks.map((task: string, idx: number) => (
                            <li key={idx} className="text-gray-700">
                              {task}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
