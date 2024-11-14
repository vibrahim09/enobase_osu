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
    return res.json().then((err) => {
      throw new Error(err.error || 'Failed to fetch');
    });
  }
  return res.json();
});

const DataTable = <T,>({ columns, dataUrl, initialVisibleRows = 10 }: DataTableProps<T>) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredData, setFilteredData] = useState<T[] | null>(null);

  const modelName = (dataUrl.split('/').pop() || 'Model').replace(/_/g, ' ');

  const { data, error } = useSWR<T[]>(dataUrl, fetcher);

  useEffect(() => {
    console.log(`DataTable fetching from: ${dataUrl}`);
    console.log('Data:', data);
    console.log('Error:', error);
  }, [dataUrl, data, error]);

  useEffect(() => {
    if (data) {
      const filtered = data.filter((row) =>
        columns.some((column) =>
          row[column.accessor]?.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setFilteredData(filtered);
    }
  }, [searchQuery, data, columns]);

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

  const visibleData = isExpanded ? filteredData || [] : (filteredData || []).slice(0, initialVisibleRows);

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
  
    // Escape special characters in the query
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Create the regex with the escaped query
    const regex = new RegExp(`(${escapedQuery})`, 'gi');
    
    // Replace matches with highlighted span using the highlight color
    return text.replace(
      regex,
      `<span style="background-color: hsl(var(--highlight));">$1</span>`
    );
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
            className="px-3 py-4 text-center text-lg font-semibold"
            style={{
              backgroundColor: 'hsl(var(--datatable-primary))',
              color: 'hsl(var(--datatable-primary-foreground))',
            }}
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-left pr-4">{modelName}</span>
              <input
                type="text"
                className="border rounded-md px-4 py-1 text-sm bg-input text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
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
                dangerouslySetInnerHTML={{
                  __html: highlightText(
                    row[column.accessor]?.toString() || '',
                    searchQuery
                  ),
                }}
              />
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