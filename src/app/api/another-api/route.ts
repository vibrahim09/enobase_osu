import  { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
import {Pool} from 'pg';


const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'northwind',
  password: 'postgres',
  port: 5432,
});

export async function POST(req: Request) {
  const { name, columns, rows } = await req.json();
  console.log('Received data:', name, columns, rows);

  try {
    // Wrap the table name in double quotes
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS "${name}" (
        ${columns.map((column: any) => `"${column.header}" ${column.type === 'number' ? 'FLOAT' : 'TEXT'}`).join(',')}
      )
    `;
    console.log('Creating table:', createTableQuery);
    await pool.query(createTableQuery);

    // Insert data with double quotes for column names
    const insertDataQuery = `
      INSERT INTO "${name}" (${columns.map((column: any) => `"${column.header}"`).join(',')})
      VALUES ${rows.map((_, rowIndex) => `(${columns.map((_, colIndex) => `$${rowIndex * columns.length + colIndex + 1}`).join(', ')})`).join(', ')}
    `;
    console.log('Inserting data:', insertDataQuery);
    const values = rows.flatMap((row: any) => columns.map((column: any) => row[column.field]));

    await pool.query(insertDataQuery, values);

    return NextResponse.json({ message: 'Data saved successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error saving data:', error);
    return NextResponse.json({ error: 'Error saving data' }, { status: 500 });
  }
}

