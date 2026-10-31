import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { TableMapType } from "@/validations/tables-validation";
import {
  applyNodeChanges,
  Background,
  NodeChange,
  ReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

export function TableNode({
  data,
}: {
  data: {
    label: string;
    capacity: number;
    status: string;
  };
}) {
  return (
    <HoverCard>
      <HoverCardTrigger
        render={
          <div
            className={cn(
              "bg-muted rounded-lg flex items-center justify-center outline-2 outline-offset-4 outline-dashed ",
              {
                "w-20 h-20": data.capacity === 2,
                "w-32 h-20": data.capacity === 4,
                "w-38 h-20": data.capacity === 6,
                "w-48 h-20": data.capacity === 8,
                "w-64 h-20": data.capacity === 10,
              },
              {
                "outline-amber-600 bg-amber-200": data.status === "reserved",
                "outline-green-600 bg-green-300": data.status === "available",
                "outline-red-600 bg-red-300": data.status === "unavailable",
              },
            )}
          >
            {data.label}
          </div>
        }
      ></HoverCardTrigger>
      <HoverCardContent className="mt-2">
        <div className="flex flex-col gap-2">
          <h4 className="text-sm font-semibold">Table {data.label}</h4>
          <p className="text-xs text-muted-foreground">
            Capacity: {data.capacity}
          </p>
          <p className="text-xs text-muted-foreground">Status: {data.status}</p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

export default function TableMap({ tables }: { tables: TableMapType[] }) {
  const nodeTypes = {
    tableNode: TableNode,
  };

  const initialNodes = useMemo(() => {
    return tables.map((table) => ({
      id: table.id,
      position: { x: table.position_x, y: table.position_y },
      data: {
        id: table.id,
        label: table.name,
        capacity: table.capacity,
        status: table.status,
      },
      type: "tableNode",
    }));
  }, [tables]);

  const [nodes, setNodes] = useState(initialNodes);
  const supabase = createClient();
  const onNodesChange = useCallback(async (changes: any) => {
    setNodes((nds) => applyNodeChanges(changes, nds));

    if (changes[0].dragging !== undefined && changes[0].dragging === false) {
      const { status } = await supabase
        .from("tables")
        .update({
          position_x: changes[0].position?.x,
          position_y: changes[0].position?.y,
        })
        .eq("id", changes[0].id);

      if (status === 204) {
        toast.success("Table position updated successfully");
      } else {
        toast.error("Failed to update table position");
      }
    }
  }, []);

  return (
    <div className="w-full h-[80vh] border rounded-lg">
      <ReactFlow
        proOptions={{ hideAttribution: true }}
        nodes={nodes}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
      >
        <Background />
      </ReactFlow>
    </div>
  );
}
