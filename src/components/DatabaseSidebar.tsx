import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Button } from '@/components/ui/button'
import { ChevronRight, Database, Table2, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DatabaseSidebarProps {
  onTableClick: (table: string) => void
}

interface TableItemProps {
  table: string
  onClick: (table: string) => void
}

const TableItem = ({ table, onClick }: TableItemProps) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Button
      className={cn(
        "w-full justify-start gap-2 my-1",
        "bg-white dark:bg-slate-900",
        "text-slate-700 dark:text-slate-200 font-normal",
        "transition-colors duration-200",
        "hover:bg-slate-100 dark:hover:bg-slate-800",
        "border border-transparent hover:border-slate-200 dark:hover:border-slate-700",
        isHovered && "bg-slate-100 dark:bg-slate-800"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick(table)}
    >
      <Table2 className="h-4 w-4" />
      {table}
    </Button>
  )
}

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
  const [tables, setTables] = useState<any[]>([])
  const [isLoading, setLoading] = useState<boolean>(true)
  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    const loadTables = async () => {
      setLoading(true)
      const fetchedTables = await fetchTables()
      setTables(fetchedTables)
      setLoading(false)
    }
    loadTables()
  }, [])

  return (
    <DndProvider backend={HTML5Backend}>
      <Card 
        className={cn(
          "transition-all duration-300 ease-in-out shadow-md",
          isCollapsed ? "w-16" : "w-64",
          "h-full"
        )}
      >
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            {!isCollapsed && <span className="font-semibold">Database</span>}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="p-0 h-6 w-6"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <ChevronRight 
              className={cn(
                "h-4 w-4 transition-transform",
                isCollapsed ? "rotate-180" : "rotate-0"
              )} 
            />
          </Button>
        </div>

        {!isCollapsed && (
          <ScrollArea className="p-4 h-[calc(100vh-120px)]">
            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="space-y-1">
                {tables.map((table, index) => (
                  <TableItem 
                    key={index} 
                    table={table.table_name} 
                    onClick={onTableClick}
                  />
                ))}
              </div>
            )}
          </ScrollArea>
        )}
      </Card>
    </DndProvider>
  )
}

export default DatabaseSidebar

