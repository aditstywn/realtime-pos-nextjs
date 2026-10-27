"use client";

import DataTable from "@/components/common/data-table";
import DropdownAction from "@/components/common/dropdown-action";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useDataTable from "@/hooks/use-data-table";
import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Table } from "@/validations/tables-validation";
import { HEADER_TABLE_TABLE } from "@/constants/table-constant";

export default function TableManagement() {
  const supabase = createClient();
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const {
    currentPage,
    handleChangePage,
    currentLimit,
    handleChangeLimit,
    currentSearch,
    handleChangeSearch,
  } = useDataTable();
  const {
    data: tables,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["tables", currentPage, currentLimit, currentSearch],
    queryFn: async () => {
      const query = supabase
        .from("tables")
        .select("*", { count: "exact" })
        .range((currentPage - 1) * currentLimit, currentPage * currentLimit - 1)
        .order("created_at");

      if (currentSearch) {
        query.or(
          `name.ilike.%${currentSearch}%,capacity.ilike.%${currentSearch}%,status.ilike.%${currentSearch}%`,
        );
      }

      const result = await query;

      if (result.error)
        toast.error("Get tables failed", { description: result.error.message });
      return result;
    },
  });

  const [selectedAction, setSelectedAction] = useState<{
    data: Table;
    type: "update" | "delete";
  } | null>();

  const handleChanngeAction = (value: boolean) => {
    if (!value) {
      setSelectedAction(null);
    }
  };

  const filteredData = useMemo(() => {
    return (tables?.data || []).map((table: Table, index) => {
      return [
        currentLimit * (currentPage - 1) + index + 1,

        <div>
          <h4 className="font-bold">{table.name}</h4>
          <p className="text-xs">{table.description}</p>
        </div>,
        table.capacity,
        <div
          className={cn("px-2 py-1 rounded-full text-white w-fit capitalize", {
            "bg-green-600": table.status === "available",
            "bg-red-600": table.status === "unavailable",
            "bg-yellow-600": table.status === "reserved",
          })}
        >
          {table.status}
        </div>,
        <DropdownAction
          menu={[
            {
              label: (
                <span className="flex items-center gap-2">
                  <Pencil />
                  Edit
                </span>
              ),
              action: () => {
                setSelectedAction({ data: table, type: "update" });
              },
            },
            {
              label: (
                <span className="flex items-center gap-2">
                  <Trash2 className="text-red-400" />
                  Delete
                </span>
              ),
              variant: "destructive",
              action: () => {
                setSelectedAction({ data: table, type: "delete" });
              },
            },
          ]}
        />,
      ];
    });
  }, [tables]);

  const totalPage = useMemo(() => {
    if (!tables?.count) return 1;
    return Math.ceil(tables.count / currentLimit);
  }, [tables]);

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row mb-4 gap-2 justify-between w-full">
        <h1 className="text-2xl font-semibold">Table Management</h1>
        <div className="flex gap-2">
          <Input
            placeholder="Search by name or category"
            onChange={(e) => handleChangeSearch(e.target.value)}
          ></Input>
          <Dialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
            <DialogTrigger
              render={<Button variant="outline">Create</Button>}
            ></DialogTrigger>
            {/* <DialogCreateMenu
              onSuccess={() => {
                setOpenCreateDialog(false);
                refetch();
              }}
            /> */}
          </Dialog>
        </div>
      </div>

      <DataTable
        header={HEADER_TABLE_TABLE}
        isLoading={isLoading}
        data={filteredData}
        totalPage={totalPage}
        currentPage={currentPage}
        onChangePage={handleChangePage}
        currentLimit={currentLimit}
        onChangeLimit={handleChangeLimit}
      />
      {/* <DialogUpdateMenu
        open={selectedAction !== null && selectedAction?.type === "update"}
        onSuccess={refetch}
        currentData={selectedAction?.data}
        handleChanngeAction={handleChanngeAction}
      /> */}
      {/* <DialogDeletemenu
        open={selectedAction !== null && selectedAction?.type === "delete"}
        onSuccess={refetch}
        currentData={selectedAction?.data}
        handleChanngeAction={handleChanngeAction}
      /> */}
    </div>
  );
}
