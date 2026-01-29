import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const body = await request.json();
    const milestone = await prisma.milestone.create({
      data: {
        title: body.title,
        description: body.description,
        dueDate: new Date(body.dueDate),
        status: body.status || 'pending',
        order: body.order,
        projectId: body.projectId,
      },
    });
    return NextResponse.json(milestone, { status: 201 });
  } catch (error) {
    console.error('Milestone creation error:', error);
    return NextResponse.json({ error: 'Failed to create milestone' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAuth();
    const body = await request.json();
    const { id, ...data } = body;

    if (data.dueDate) {
      data.dueDate = new Date(data.dueDate);
    }

    const milestone = await prisma.milestone.update({
      where: { id },
      data,
    });
    return NextResponse.json(milestone);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update milestone' }, { status: 500 });
  }
}
