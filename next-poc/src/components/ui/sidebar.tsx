// src/components/ui/Sidebar.tsx

"use client"; // Ensure it's a client component for interactivity

import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, PlusIcon } from '@radix-ui/react-icons';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { PrismaModel } from '@/types/prisma'; // Adjust the import path as needed

interface SidebarProps {
  models: PrismaModel[];
  onAddModel: (model: PrismaModel) => void; // Callback to add a model
}

const Sidebar: React.FC<SidebarProps> = ({ models, onAddModel }) => {
  const [allExpanded, setAllExpanded] = useState<boolean>(false);

  // Handler to toggle all sections
  const toggleAll = () => {
    setAllExpanded((prev) => !prev);
  };

  // Determine default expanded items based on allExpanded state
  const defaultExpanded = allExpanded ? models.map((model) => model.name) : [];

  return (
    <div className="w-64 bg-gray-100 p-4 overflow-y-auto sidebar-container">
      <div className="flex justify-between items-center mb-4">
        <h2 className="flex justify-center text-lg font-semibold">DB Tables</h2>

      </div>
      <AccordionPrimitive.Root
        type="multiple"
        defaultValue={defaultExpanded}
        className="space-y-2"
      >
        {models.map((model) => (
          <AccordionPrimitive.Item key={model.name} value={model.name}>
            <AccordionPrimitive.Header>
              <AccordionPrimitive.Trigger className="flex justify-between items-center w-full px-3 py-2 bg-white rounded-md hover:bg-gray-50 focus:outline-none">
                <span className="text-sm font-medium text-gray-700">{model.name}</span>
                <div className="flex items-center space-x-2">
                  {/* Plus Icon as a <span> */}
                  <span
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent accordion toggle
                      onAddModel(model);
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onAddModel(model);
                      }
                    }}
                    className="p-1 text-green-500 hover:text-green-600 cursor-pointer"
                    aria-label={`Add ${model.name} table`}
                  >
                    <PlusIcon className="w-4 h-4" />
                  </span>
                  {/* Expand/Collapse Icon */}
                  {allExpanded ? (
                    <ChevronUpIcon className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronDownIcon className="w-4 h-4 text-gray-500" />
                  )}
                </div>
              </AccordionPrimitive.Trigger>
            </AccordionPrimitive.Header>
            <AccordionPrimitive.Content className="px-4 py-2 bg-gray-50 rounded-b-md">
              <ul className="list-disc list-inside space-y-1">
                {model.fields.map((field) => (
                  <li key={field} className="text-sm text-gray-600">
                    {field}
                  </li>
                ))}
              </ul>
            </AccordionPrimitive.Content>
          </AccordionPrimitive.Item>
        ))}
      </AccordionPrimitive.Root>
    </div>
  );
};

export default Sidebar;
