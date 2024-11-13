// src/components/ui/datatable.tsx

"use client"; // Ensures the component is rendered on the client side

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useSWR from 'swr';
import Spinner from './spinner'; // Ensure you have a Spinner component
import { ScrollArea, ScrollBar } from './scroll-area'; // Import Shadcn's ScrollArea components

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
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Fetch data using SWR
  const { data, error } = useSWR<T[]>(dataUrl, fetcher);

  // Debugging: Log data and error
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

  // Determine the data to display based on the expansion state
  const visibleData = isExpanded ? data : data.slice(0, initialVisibleRows);

  // Handler to toggle expansion state
  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  // Handler to update position on drag end
  const handleDragEnd = (_event: any, info: any) => {
    setPosition({ x: position.x + info.delta.x, y: position.y + info.delta.y });
  };

  return (
    <motion.div
      className="flex justify-center pb-6 pt-6 relative z-50"
      drag
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      style={{ x: position.x, y: position.y }}
      whileDrag={{ cursor: "grabbing" }}
    >
      <ScrollArea className="w-auto whitespace-nowrap rounded-md border-0">
          <table className="min-w-full divide-y divide-gray-200 border-0" >
            <thead>
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className="px-3 py-2 bg-gray-50 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleData.map((row, rowIndex) => (
                <tr key={rowIndex} className="bg-white even:bg-gray-50 hover:bg-gray-100">
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className="px-3 py-2 whitespace-nowrap text-xs text-gray-900"
                    >
                      {row[column.accessor]?.toString() || '-'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
      
      {/* Toggle Button */}
      {data.length > initialVisibleRows && (
        <div className="flex justify-center mt-2 mb-2">
          <button
            onClick={toggleExpand}
            className="w-full h-full bg-gray-200 text-white rounded hover:bg-gray-300 focus:outline-none"
          >
            {isExpanded ? 'Show Less' : 'Show More'}
          </button>
        </div>
      )}
            <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </motion.div>
  );
};

export default DataTable;
