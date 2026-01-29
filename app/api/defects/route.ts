import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/session';

export async function GET(request: NextRequest) {
  try {
    await requireAuth();
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    const where = projectId ? { projectId } : {};

    const defects = await prisma.defect.findMany({
      where,
      include: { project: true },
      orderBy: { reportedDate: 'desc' },
    });
    return NextResponse.json(defects);
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const body = await request.json();
    const defect = await prisma.defect.create({
      data: body,
    });
    return NextResponse.json(defect, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create defect' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAuth();
    const body = await request.json();
    const { id, ...data } = body;

    if (data.status === 'fixed' && !data.fixedDate) {
      data.fixedDate = new Date();
    }
    if (data.status === 'approved' && !data.approvedDate) {
      data.approvedDate = new Date();
    }

    const defect = await prisma.defect.update({
      where: { id },
      data,
    });
    return NextResponse.json(defect);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update defect' }, { status: 500 });
  }
}
