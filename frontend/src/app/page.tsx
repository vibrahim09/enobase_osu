// src/app/page.tsx
"use client";

import React, { useState, useRef, useEffect } from 'react';
import Layout from './layout';
import DataTable from '../components/ui/datatable';
import Spinner from '../components/ui/spinner';
import { ScrollArea, ScrollBar } from '../components/ui/scroll-area';
import { PrismaModel } from '@/types/prisma';
import useSWR from 'swr';
import { ModelSidebar } from '../components/ui/model-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { MoonIcon, SunIcon } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const HomePage = () => {
  const [activeModels, setActiveModels] = useState<PrismaModel[]>([]);
  const [positions, setPositions] = useState<{ [key: string]: { x: number; y: number } }>({});
  const isDragging = useRef<boolean>(false);
  const dragStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const currentModel = useRef<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

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

  // Handle mouse down for dragging
  const handleMouseDown = (event: React.MouseEvent, modelName: string) => {
    isDragging.current = true;
    dragStart.current = { x: event.clientX, y: event.clientY };
    currentModel.current = modelName;
    document.body.style.userSelect = 'none'; // Prevent text selection
    document.body.style.cursor = 'grab';
  };

  // Handle mouse move for dragging
  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isDragging.current || !currentModel.current) return;
    const dx = event.clientX - dragStart.current.x;
    const dy = event.clientY - dragStart.current.y;
    setPositions((prevPositions) => ({
      ...prevPositions,
      [currentModel.current!]: {
        x: (prevPositions[currentModel.current!]?.x || 0) + dx,
        y: (prevPositions[currentModel.current!]?.y || 0) + dy,
      },
    }));
    dragStart.current = { x: event.clientX, y: event.clientY };
    document.body.style.cursor = 'grabbing';
  };

  // Handle mouse up to stop dragging
  const handleMouseUp = () => {
    isDragging.current = false;
    currentModel.current = null;
    document.body.style.userSelect = ''; // Re-enable text selection
    document.body.style.cursor = 'default';
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  useEffect(() => {
    document.body.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

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
      <button
        onClick={toggleDarkMode}
        className="fixed top-4 right-4 z-10 p-2 rounded"
      >
        {isDarkMode ? <SunIcon className="w-4 h-4" /> : <MoonIcon className="w-4 h-4" />}
      </button>
      <ScrollArea className="h-screen w-full align-middle rounded-md">
        <SidebarProvider>
          <div className="flex flex-col md:flex-row h-full w-full">
            <ModelSidebar models={models} onAddModel={handleAddModel} onRemoveModel={handleRemoveModel} />
            <div
              className="flex-1 overflow-auto relative hide-scrollbar"
              style={{
                backgroundSize: '75px 75px',
                backgroundImage: `
                  linear-gradient(to right, var(--gradient-light) 1px, transparent 1px),
                  linear-gradient(to bottom, var(--gradient-light) 1px, transparent 1px)
                `,
              }}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <div className="p-4 space-y-6">
                {activeModels.map((model) => (
                  <div
                    key={model.name}
                    className="absolute"
                    style={{
                      transform: `translate(${positions[model.name]?.x || 0}px, ${positions[model.name]?.y || 0}px)`,
                    }}
                    onMouseDown={(e) => handleMouseDown(e, model.name)}
                  >
                    <DataTable
                      columns={getColumns(model)}
                      dataUrl={`/api/data/${model.name}`}
                      initialVisibleRows={10}
                    />
                  </div>
                ))}
                {activeModels.length === 0 && (
                  <div className="z-50 text-center text-gray-500">
                    Select a table from the sidebar to view its data.
                  </div>
                )}
              </div>
            </div>
          </div>
        </SidebarProvider>
      </ScrollArea>
    </Layout>
  );
};

export default HomePage;
