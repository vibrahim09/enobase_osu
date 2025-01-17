"use client"; // Ensure it's a client component for interactivity

import * as React from "react"
import { CheckCircleIcon, GalleryVerticalEnd, Minus, Plus } from "lucide-react"
import { useState, useEffect, useRef } from 'react';
import { ChevronDownIcon, ChevronUpIcon, PlusIcon, Cross1Icon, CheckIcon, CheckboxIcon } from '@radix-ui/react-icons';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { PrismaModel } from '@/types/prisma';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"

interface SidebarProps {
    models: PrismaModel[];
    onAddModel: (model: PrismaModel) => void; // Callback to add a model
    onRemoveModel: (model: PrismaModel) => void; // Callback to remove a model
  }

export function ModelSidebar({ models, onAddModel, onRemoveModel }: SidebarProps) {
    const [addedModels, setAddedModels] = useState<Set<string>>(new Set());
    const pendingUpdates = useRef<{ add: PrismaModel[]; remove: PrismaModel[] }>({ add: [], remove: [] });
  

    const handleToggleModel = (model: PrismaModel) => {
      setAddedModels((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(model.name)) {
          newSet.delete(model.name);
          pendingUpdates.current.remove.push(model);
        } else {
          newSet.add(model.name);
          pendingUpdates.current.add.push(model);
        }
        return newSet;
      });
    };
  
    useEffect(() => {
      // Process pending updates after render
      pendingUpdates.current.add.forEach(onAddModel);
      pendingUpdates.current.remove.forEach(onRemoveModel);
      // Clear pending updates
      pendingUpdates.current = { add: [], remove: [] };
    }, [addedModels, onAddModel, onRemoveModel]);
  
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Tables</span>
                  <span className=""></span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="hide-scrollbar">
        <SidebarGroup>
          <SidebarMenu>
            {models.map((model) => (
              <Collapsible
                key={model.name}
                defaultOpen={false}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <span className="truncate">{model.name}{" "}</span>
                      <Plus className="ml-auto group-data-[state=open]/collapsible:hidden" />
                      <Minus className="ml-auto group-data-[state=closed]/collapsible:hidden" />
                      <span
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent accordion toggle
                      handleToggleModel(model);
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleToggleModel(model);
                      }
                    }}
                    className={`p-1 cursor-pointer  ${
                      addedModels.has(model.name) ? 'text-red-500 hover:text-red-600' : 'text-green-500 hover:text-green-600'
                    }`}
                    aria-label={`Toggle ${model.name} table`}
                  >
                    {addedModels.has(model.name) ? <Cross1Icon className="w-4 h-4" /> : <CheckIcon className="w-4 h-4" />}
                  </span>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {model.fields?.length ? (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {model.fields.map((field) => (
                          <SidebarMenuSubItem key={field}>
                            {field}
                            <SidebarMenuSubButton
                              asChild
                            >
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  ) : null}
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
