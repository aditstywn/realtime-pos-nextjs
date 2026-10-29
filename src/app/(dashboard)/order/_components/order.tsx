"use client";

import DataTable from "@/components/common/data-table";
import DropdownAction from "@/components/common/dropdown-action";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useDataTable from "@/hooks/use-data-table";
import { createClientSupabase } from "@/lib/supabase/default";
import { useQuery } from "@tanstack/react-query";
import {
  startTransition,
  useActionState,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Table } from "@/validations/tables-validation";
import { HEADER_TABLE_ORDER } from "@/constants/order-constant";
import DialogCreateOrder from "./dialog-create-order";
import Link from "next/link";
import { Ban, Link2Icon, ScrollText } from "lucide-react";
import { updateReservation } from "../actions";
import { INITIAL_STATE_ACTION } from "@/constants/general-constant";
import { useAuthStore } from "@/store/auth-store";

export default function OrderManagement() {
  const profile = useAuthStore((state) => state.profile);
  const supabase = createClientSupabase();
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
    data: orders,
    isLoading,
    refetch: refetchOrders,
  } = useQuery({
    queryKey: ["orders", currentPage, currentLimit, currentSearch],
    queryFn: async () => {
      const query = supabase
        .from("orders")
        .select(
          `
            id, order_id, customer_name, status, payment_token, tables (name, id)
            `,
          { count: "exact" },
        )
        .range((currentPage - 1) * currentLimit, currentPage * currentLimit - 1)
        .order("created_at");

      if (currentSearch) {
        query.or(
          `order_id.ilike.%${currentSearch}%,customer_name.ilike.%${currentSearch}%`,
        );
      }

      const result = await query;

      if (result.error)
        toast.error("Get Order data failed", {
          description: result.error.message,
        });

      return result;
    },
  });

  const { data: tables, refetch: refetchTables } = useQuery({
    queryKey: ["tables"],
    queryFn: async () => {
      const result = await supabase
        .from("tables")
        .select("*")
        .order("created_at")
        .order("status");

      return result.data;
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel("change-order")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
        },
        () => {
          refetchOrders();
          refetchTables();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const [selectedAction, setSelectedAction] = useState<{
    data: Table;
    type: "update" | "delete";
  } | null>();

  const handleChanngeAction = (value: boolean) => {
    if (!value) {
      setSelectedAction(null);
    }
  };

  const totalPage = useMemo(() => {
    return orders && orders.count !== null
      ? Math.ceil(orders.count / currentLimit)
      : 0;
  }, [orders]);

  const [reservedState, reservedAction] = useActionState(
    updateReservation,
    INITIAL_STATE_ACTION,
  );

  const handleReservation = async ({
    id,
    table_id,
    status,
  }: {
    id: string;
    table_id: string;
    status: string;
  }) => {
    const formData = new FormData();
    Object.entries({ id, table_id, status }).forEach(([Key, value]) => {
      formData.append(Key, value);
    });
    startTransition(() => {
      reservedAction(formData);
    });
  };

  useEffect(() => {
    if (reservedState?.status === "error") {
      toast.error("Update Reservation Failed", {
        description: reservedState.errors?._form?.[0],
      });
    }

    if (reservedState?.status === "success") {
      toast.success("Update Reservation Success");
    }
  }, [reservedState]);

  const reservedActionList = [
    {
      label: (
        <span className="flex items-center gap-2">
          <Link2Icon />
          Process
        </span>
      ),
      action: (id: string, table_id: string) => {
        handleReservation({ id, table_id, status: "process" });
      },
    },
    {
      label: (
        <span className="flex items-center gap-2">
          <Ban className="text-red-500" />
          Cancel
        </span>
      ),
      action: (id: string, table_id: string) => {
        handleReservation({ id, table_id, status: "canceled" });
      },
    },
  ];

  const filteredData = useMemo(() => {
    return (orders?.data || []).map((order, index) => {
      return [
        currentLimit * (currentPage - 1) + index + 1,
        order.order_id,
        order.customer_name,
        (order.tables as unknown as { name: string }).name,
        <div
          className={cn("px-2 py-1 rounded-full text-white w-fit capitalize", {
            "bg-lime-600": order.status === "settled",
            "bg-sky-600": order.status === "process",
            "bg-amber-600": order.status === "reserved",
            "bg-red-600": order.status === "canceled",
          })}
        >
          {order.status}
        </div>,
        <DropdownAction
          menu={
            order.status === "reserved" && profile?.role !== "kitchen"
              ? reservedActionList.map((item) => ({
                  label: item.label,
                  action: () =>
                    item.action(
                      order.id,
                      (order.tables as unknown as { id: string }).id,
                    ),
                }))
              : [
                  {
                    label: (
                      <Link
                        href={`/order/${order.order_id}`}
                        className="flex items-center gap-2"
                      >
                        <ScrollText />
                        Detail
                      </Link>
                    ),
                    type: "link",
                  },
                ]
          }
        />,
      ];
    });
  }, [orders]);

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row mb-4 gap-2 justify-between w-full">
        <h1 className="text-2xl font-semibold">Order Management</h1>
        <div className="flex gap-2">
          <Input
            placeholder="Search by name or capacity"
            onChange={(e) => handleChangeSearch(e.target.value)}
          ></Input>
          {profile?.role !== "kitchen" && (
            <Dialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
              <DialogTrigger
                render={<Button variant="outline">Create</Button>}
              ></DialogTrigger>
              <DialogCreateOrder
                onSuccess={() => {
                  setOpenCreateDialog(false);
                  refetchTables();
                }}
                tables={tables ?? []}
              />
            </Dialog>
          )}
        </div>
      </div>

      <DataTable
        header={HEADER_TABLE_ORDER}
        isLoading={isLoading}
        data={filteredData}
        totalPage={totalPage}
        currentPage={currentPage}
        onChangePage={handleChangePage}
        currentLimit={currentLimit}
        onChangeLimit={handleChangeLimit}
      />
      {/* <DialogUpdateTable
        open={selectedAction !== null && selectedAction?.type === "update"}
        onSuccess={refetch}
        currentData={selectedAction?.data}
        handleChanngeAction={handleChanngeAction}
      /> */}
      {/* <DialogDeleteTable
        open={selectedAction !== null && selectedAction?.type === "delete"}
        onSuccess={refetch}
        currentData={selectedAction?.data}
        handleChanngeAction={handleChanngeAction}
      /> */}
    </div>
  );
}
