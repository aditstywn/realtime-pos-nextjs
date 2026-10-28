import { Suspense } from "react";
import AddOrderItem from "./_component/add-order-item";

export const metadata = {
  title: "RAS | Add Order Item ",
};

async function AddOrderItemContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AddOrderItem id={id} />;
}

export default function AddOrderItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={null}>
      <AddOrderItemContent params={params} />
    </Suspense>
  );
}
