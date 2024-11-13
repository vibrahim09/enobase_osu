// src/app/api/data/[model]/route.ts

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Define a schema for model name validation to prevent SQL injection
const modelSchema = z.string().regex(/^[A-Za-z_][A-Za-z0-9_]*$/);

export async function GET(
  request: Request,
  { params }: { params: { model: string } }
) {
  // Access the model parameter directly from the context
  const { model } = params;

  // Validate the model name
  const validation = modelSchema.safeParse(model);
  if (!validation.success) {
    return NextResponse.json({ error: 'Invalid model name' }, { status: 400 });
  }

  try {
    // Fetch the list of tables from the database
    const tables = await prisma.$queryRaw<{ table_name: string }[]>`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
    `;

    // Check if the requested model is in the list of tables
    const tableNames = tables.map((table) => table.table_name.toLowerCase());
    if (!tableNames.includes(model.toLowerCase())) {
      return NextResponse.json({ error: 'Model not found' }, { status: 404 });
    }

    // Dynamically query the model
    const data = await prisma.$queryRawUnsafe(`SELECT * FROM ${model}`);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error(`Error fetching data for model ${model}:`, error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch data' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
