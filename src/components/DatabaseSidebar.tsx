import React, { useEffect, useState} from 'react'
import {Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { useDrag } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'

interface DatabaseSidebarProps {
    onTableClick: (table: string) => void;
}
interface TableItemProps {
    table: string;
    onClick: (table: string) => void;
}

const TableItem: React.FC<TableItemProps> = ({table, onClick }) => {
    return (
        <li className = "p-2 cursor-pointer"
            onClick = {() => onClick(table)}
            >
            {table}
        </li>
    );
    };

const fetchTables = async  (): Promise<any[]> => {
    try{
        // try to get table from this api
        console.log("Fetching table data..");
        const response = await fetch(`/api/database-api?database=postgres`);

        if (!response.ok){
            throw new Error('Failed to fetch tables');
        }
        const {result, error} = await response.json();
        console.log("API response:", result);
        return result || [];
      
    } catch (error){
        console.error('Error fetching tables:', error);
        return [];

    }
};
const DatabaseSidebar: React.FC<DatabaseSidebarProps> = ({ onTableClick }) => {
    const [tables, setTables] = useState<any[]>([]);
    const [isLoading, setLoading] = useState<boolean>(true);
    useEffect(()=>{
        const loadTables = async () => {
            setLoading(true);
            //passing in the result in the fetched tables
            const fetchedTables = await fetchTables();
            setTables(fetchedTables);
            setLoading(false);
        };
        loadTables();
    }, []);
    return (
        <DndProvider backend={HTML5Backend}>
            <Card className = "w-64 h-full shadow-md">
                <ScrollArea className = "p-4">
                    <h2 className = "text-lg font-semibold">Postgres Database</h2>
                    {isLoading ? (
                        <p>Loading...</p>
                    ) : (
                        <ul>
              {tables.map((table, index) => (
                <TableItem key={index} table={table.table_name} onClick={onTableClick}/>
              ))}
            </ul>

                       
                    )}
                </ScrollArea>
            </Card>
        </DndProvider>
    );
    };
export default DatabaseSidebar;

