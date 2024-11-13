// src/app/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Layout from './layout';
import DataTable from '../components/ui/datatable';
import Spinner from '../components/ui/spinner';
//import Sidebar from '../components/ui/modelSidebar'; 
import { ScrollArea } from '../components/ui/scroll-area';
import { PrismaModel } from '@/types/prisma';
import useSWR from 'swr';
import ModelSidebar from '../components/ui/modelSidebar';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const HomePage = () => {
  const [activeModels, setActiveModels] = useState<PrismaModel[]>([]);
  // Fetch models
  const { data: models, error: modelError } = useSWR<PrismaModel[]>('/api/models', fetcher);

  // Function to handle adding a new DataTable
  const handleAddModel = (model: PrismaModel) => {
    setActiveModels((prevModels) => {
      if (prevModels.find((m) => m.name === model.name)) {
        return prevModels;
      }
      return [...prevModels, model];
    });
  };

  // Function to handle removing a DataTable
  const handleRemoveModel = (model: PrismaModel) => {
    setActiveModels((prevModels) => prevModels.filter((m) => m.name !== model.name));
  };

  if (!models) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <Spinner />
        </div>
      </Layout>
    );
  }

  if (modelError) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500">
            Error: {modelError.message || 'An unexpected error occurred'}
          </p>
        </div>
      </Layout>
    );
  }

  const getColumns = (model: PrismaModel) => {
    return model.fields.map((field) => ({
      header: field.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()),
      accessor: field as keyof any,
    }));
  };

  return (
    <Layout>
      <ScrollArea className="h-screen w-full align-middle rounded-md border p-4">
        <div className="flex flex-col md:flex-row">
          <ModelSidebar models={models} onAddModel={handleAddModel} onRemoveModel={handleRemoveModel} />
          <div className="flex-1 p-4 space-y-6">
            {activeModels.map((model) => (
              <DataTable
                key={model.name}
                columns={getColumns(model)}
                dataUrl={`/api/data/${model.name}`}
                initialVisibleRows={10}
              />
            ))}
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
