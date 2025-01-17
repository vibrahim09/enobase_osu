import React from 'react';
import { motion } from 'framer-motion';
import { ScrollArea, ScrollBar } from './scroll-area';

interface LLMDataTableProps {
  data: Record<string, Record<string, string>>; // Updated to handle nested data with multiple columns
  prompt: string; // The user's prompt
}

const LLMDataTable: React.FC<LLMDataTableProps> = ({ data, prompt }) => {
  // Transform data into rows and dynamically extract column keys
  const rows = Object.entries(data).map(([key, value]) => ({ resultKey: key, ...value }));
  const columnKeys = rows.length > 0 ? Object.keys(rows[0]).filter((key) => key !== 'resultKey') : [];

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
                colSpan={columnKeys.length + 1} // Dynamically span all columns
                className="px-3 py-4 text-center text-lg font-semibold"
                style={{
                  backgroundColor: 'hsl(var(--datatable-primary))',
                  color: 'hsl(var(--datatable-primary-foreground))',
                }}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-left">{prompt}</span>
                </div>
              </th>
            </tr>
            <tr>
              <th
                className="px-3 py-2 text-left text-sm font-medium uppercase tracking-wider"
                style={{
                  backgroundColor: 'hsl(var(--datatable-background))',
                  color: 'hsl(var(--datatable-foreground))',
                }}
              >
                Result
              </th>
              {columnKeys.map((colKey) => (
                <th
                  key={colKey}
                  className="px-3 py-2 text-left text-sm font-medium uppercase tracking-wider"
                  style={{
                    backgroundColor: 'hsl(var(--datatable-background))',
                    color: 'hsl(var(--datatable-foreground))',
                  }}
                >
                  {colKey.replace('column_', 'Column ')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
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
                <td
                  className="px-3 py-2 whitespace-nowrap text-xs font-semibold"
                  style={{ color: 'hsl(var(--datatable-accent-foreground))' }}
                >
                  {row.resultKey}
                </td>
                {columnKeys.map((colKey) => (
                  <td
                    key={colKey}
                    className="px-3 py-2 whitespace-nowrap text-xs"
                    style={{ color: 'hsl(var(--datatable-accent-foreground))' }}
                  >
                    {row[colKey]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </motion.div>
  );
};

export default LLMDataTable;
