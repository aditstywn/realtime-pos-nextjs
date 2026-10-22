import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";

export default function PaginationDataTable({
  totalPage,
  currentPage,
  onChangePage,
}: {
  totalPage: number;
  currentPage: number;
  onChangePage: (page: number) => void;
}) {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => {
              if (currentPage > 1) {
                onChangePage(currentPage - 1);
              } else {
                onChangePage(totalPage);
              }
            }}
          />
        </PaginationItem>
        {Array.from({ length: totalPage }).map((_, i) => {
          const page = i + 1;
          if (
            page === 1 ||
            page === totalPage ||
            Math.abs(page - currentPage) <= 1
          ) {
            return (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => {
                    if (page !== currentPage) {
                      onChangePage(page);
                    }
                  }}
                  isActive={page === currentPage}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            );
          }

          if (
            (page === currentPage - 2 && page > 1) ||
            (page === currentPage + 2 && page < totalPage)
          ) {
            return (
              <PaginationItem key={page}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }
        })}

        <PaginationItem>
          <PaginationNext
            onClick={() => {
              if (currentPage < totalPage) {
                onChangePage(currentPage + 1);
              } else {
                onChangePage(1);
              }
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
