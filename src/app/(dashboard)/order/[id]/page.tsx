import { Suspense } from "react";
import DetailOrder from "./_components/detail-order";

export const metadata = {
  title: "RAS | Detail Order ",
};

async function DetailOrderContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <DetailOrder id={id} />;
}

export default function DetailOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={null}>
      <DetailOrderContent params={params} />
    </Suspense>
  );
}
