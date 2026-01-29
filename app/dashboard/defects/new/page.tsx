import Header from '@/components/Header';
import NewDefectForm from '@/components/NewDefectForm';
import { prisma } from '@/lib/db';

export default async function NewDefectPage() {
  const projects = await prisma.project.findMany({
    orderBy: { updatedAt: 'desc' },
  });

  return (
    <div>
      <Header title="Report Defect" description="Add a new defect / punch list item" />
      <div className="p-6">
        {projects.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-gray-700">
            You need at least one project before you can report a defect.
          </div>
        ) : (
          <NewDefectForm projects={projects} />
        )}
      </div>
    </div>
  );
}
