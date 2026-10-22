import { ReactNode } from "react";
import { Card } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import PaginationDataTable from "./pagination-data-table";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { LIMIT_LISTS } from "@/constants/datatable-constant";

export default function DataTable({
  header,
  data,
  isLoading,
  totalPage,
  currentPage,
  onChangePage,
  currentLimit,
  onChangeLimit,
}: {
  header: string[];
  data: (string | ReactNode)[][];
  isLoading?: boolean;
  totalPage: number;
  currentPage: number;
  onChangePage: (page: number) => void;
  currentLimit: number;
  onChangeLimit: (limit: number) => void;
}) {
  return (
    <div className="w-full flex flex-col gap-4">
      <Card className="p-0">
        <Table className="w-full rounded-lg overflow-hidden">
          <TableHeader className="bg-muted sticky top-0 z-10">
            <TableRow>
              {header.map((column) => (
                <TableHead key={`th-${column}`} className="px-6 py-3">
                  {column}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={`tr-${index}`}>
                {row.map((cell, cellIndex) => (
                  <TableCell
                    key={`tc-${index}-${cellIndex}`}
                    className="px-6 py-3"
                  >
                    {cell}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {data?.length === 0 && !isLoading && (
              <TableRow>
                <TableCell colSpan={header.length} className="h-24 text-center">
                  No data available
                </TableCell>
              </TableRow>
            )}
            {isLoading && (
              <TableRow>
                <TableCell colSpan={header.length} className="h-24 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Label>Limit</Label>
          <Select
            value={currentLimit.toString()}
            onValueChange={(value) => onChangeLimit(Number(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a limit" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Limit</SelectLabel>
                {LIMIT_LISTS.map((limit) => (
                  <SelectItem key={limit} value={limit.toString()}>
                    {limit}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        {totalPage > 1 && (
          <div className="flex justify-end">
            <PaginationDataTable
              currentPage={currentPage}
              totalPage={totalPage}
              onChangePage={onChangePage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
