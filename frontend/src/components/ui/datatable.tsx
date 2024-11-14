// src/components/ui/datatable.tsx

"use client"; // Ensures the component is rendered on the client side

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useSWR from 'swr';
import Spinner from './spinner'; // Ensure you have a Spinner component
import { ScrollArea, ScrollBar } from './scroll-area'; // Import Shadcn's ScrollArea components
import { ChevronUp, ChevronDown } from 'lucide-react'; // Import Lucide icons

interface Column<T> {
  header: string;
  accessor: keyof T;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  dataUrl: string; // URL to fetch data from
  initialVisibleRows?: number; // Optional prop to set initial visible rows
}

const fetcher = (url: string) => fetch(url).then((res) => {
  if (!res.ok) {
    return res.json().then((err) => { throw new Error(err.error || 'Failed to fetch'); });
  }
  return res.json();
});

const DataTable = <T,>({ columns, dataUrl, initialVisibleRows = 10 }: DataTableProps<T>) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const modelName = (dataUrl.split('/').pop() || 'Model').replace(/_/g, ' ');

  const { data, error } = useSWR<T[]>(dataUrl, fetcher);

  useEffect(() => {
    console.log(`DataTable fetching from: ${dataUrl}`);
    console.log('Data:', data);
    console.log('Error:', error);
  }, [dataUrl, data, error]);

  if (error) {
    return <div className="text-red-500">Failed to load data: {error.message}</div>;
  }

  if (!data) {
    return (
      <div className="flex justify-center items-center h-32">
        <Spinner />
      </div>
    );
  }

  if (!Array.isArray(data)) {
    return <div className="text-red-500">Invalid data format received.</div>;
  }

  const visibleData = isExpanded ? data : data.slice(0, initialVisibleRows);

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <motion.div className="flex justify-center pb-6 pt-6 relative z-1">
      <ScrollArea className="w-auto whitespace-nowrap rounded-md border-0">
        <table
          className="data-table min-w-full divide-y border-0"
          style={{
            backgroundColor: 'hsl(var(--datatable-background))',
            color: 'hsl(var(--datatable-foreground))',
          }}
        >
          <thead>
            <tr>
              <th
                colSpan={columns.length}
                className="px-3 py-2 text-center text-lg font-semibold"
                style={{
                  backgroundColor: 'hsl(var(--datatable-primary))',
                  color: 'hsl(var(--datatable-primary-foreground))',
                }}
              >
                {modelName}
              </th>
            </tr>
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-3 py-2 text-left text-sm font-medium uppercase tracking-wider"
                  style={{
                    backgroundColor: 'hsl(var(--datatable-background))',
                    color: 'hsl(var(--datatable-foreground))',
                  }}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="hover:bg-opacity-80"
                style={{
                  backgroundColor:
                    rowIndex % 2 === 0
                      ? 'hsl(var(--datatable-accent))'
                      : 'hsl(var(--datatable-background))',
                  color: 'hsl(var(--datatable-foreground))',
                }}
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-3 py-2 whitespace-nowrap text-xs"
                    style={{ color: 'hsl(var(--datatable-accent-foreground))' }}
                  >
                    {row[column.accessor]?.toString() || '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {data.length > initialVisibleRows && (
          <div className="flex justify-center mt-0 mb-2">
            <button
              onClick={toggleExpand}
              className="w-full h-full flex justify-center rounded focus:outline-none"
              style={{
                color: 'hsl(var(--datatable-primary-foreground))',
                backgroundColor: 'hsl(var(--datatable-primary))',
              }}
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        )}
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </motion.div>
  );
};


export default DataTable;
