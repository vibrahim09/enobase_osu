// src/app/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import Layout from './layout';
import DataTable from '../components/ui/datatable'; // Ensure the path and casing match your project structure
import Spinner from '../components/ui/spinner'; // Custom Spinner component
import Sidebar from '../components/ui/sidebar'; // Sidebar component
import { ScrollArea } from '../components/ui/scroll-area'; // Import Shadcn's ScrollArea components
import { PrismaModel } from '@/types/prisma'; // Import the PrismaModel interface
import useSWR from 'swr';

interface Customer {
  customer_id: string;
  company_name: string;
  contact_name?: string;
  // Add other fields as needed
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const HomePage = () => {
  const [activeModels, setActiveModels] = useState<PrismaModel[]>([]);

  // Fetch customers
  const { data: customers, error: customerError } = useSWR<Customer[]>('/api/customers', fetcher);

  // Fetch models
  const { data: models, error: modelError } = useSWR<PrismaModel[]>('/api/models', fetcher);

  if (!customers || !models) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <Spinner />
        </div>
      </Layout>
    );
  }

  if (customerError || modelError) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500">
            Error: {customerError?.message || modelError?.message || 'An unexpected error occurred'}
          </p>
        </div>
      </Layout>
    );
  }

  // Define the columns for the DataTable (generic)
  // Assuming that each model's fields can be mapped to columns dynamically
  const getColumns = (model: PrismaModel) => {
    return model.fields.map((field) => ({
      header: field.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()),
      accessor: field as keyof any, // Using 'any' since we don't have a generic type
    }));
  };

  // Function to handle adding a new DataTable
  const handleAddModel = (model: PrismaModel) => {
    setActiveModels((prevModels) => {
      // Prevent adding duplicate models
      if (prevModels.find((m) => m.name === model.name)) {
        return prevModels;
      }
      return [...prevModels, model];
    });
  };

  return (
    <Layout>
      <ScrollArea className="h-screen w-full rounded-md border p-4">
          <div className="flex flex-col md:flex-row">
            {/* Sidebar */}
            <Sidebar models={models} onAddModel={handleAddModel} />

            {/* Main Content */}
            <div className="flex-1 p-4 space-y-6">
              {activeModels.map((model) => (
                <DataTable
                  key={model.name} // Add a unique key prop here
                  columns={getColumns(model)}
                  dataUrl={`/api/data/${model.name}`}
                  initialVisibleRows={10}
                />
              ))}
              {/* Optionally, you can display a message when no DataTables are active */}
              {activeModels.length === 0 && (
                <div className="text-center text-gray-500">
                  Select a table from the sidebar to view its data.
                </div>
              )}
            </div>
          </div>
      </ScrollArea>
    </Layout>
  );
};

export default HomePage;
