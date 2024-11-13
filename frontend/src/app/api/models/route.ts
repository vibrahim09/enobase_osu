// src/app/api/models/route.ts

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Define TypeScript interfaces for the query results
interface Table {
  table_name: string;
}

interface Column {
  column_name: string;
}

interface PrismaModel {
  name: string;
  fields: any[];
}

export async function GET() {
  try {
    // Retrieve all table names from the Prisma schema
    const tables: Table[] = await prisma.$queryRaw<Table[]>`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
    `;

    // For each table, retrieve its columns
    const models: PrismaModel[] = await Promise.all(
      tables.map(async (table) => {
        const columns: Column[] = await prisma.$queryRaw<Column[]>`
          SELECT column_name
          FROM information_schema.columns
          WHERE table_name = ${table.table_name};
        `;
        return {
          name: table.table_name,
          fields: columns.map((col) => col.column_name),
        };
      })
    );

    return NextResponse.json(models);
  } catch (error: any) {
    console.error('Error fetching models:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch models' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
