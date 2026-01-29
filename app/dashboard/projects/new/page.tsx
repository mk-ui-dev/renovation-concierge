import Header from '@/components/Header';
import NewProjectForm from '@/components/NewProjectForm';
import { prisma } from '@/lib/db';

export default async function NewProjectPage() {
  const clients = await prisma.user.findMany({
    where: { role: 'client' },
    orderBy: { name: 'asc' },
  });

  return (
    <div>
      <Header title="New Project" description="Create a new renovation project" />
      <div className="p-6">
        <NewProjectForm clients={clients} />
      </div>
    </div>
  );
}
