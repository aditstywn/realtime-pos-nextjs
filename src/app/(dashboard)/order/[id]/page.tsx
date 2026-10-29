import { Suspense } from "react";
import DetailOrder from "./_components/detail-order";
import MidtransScript from "./_components/midtrans-script";

export const metadata = {
  title: "RAS | Detail Order ",
};
declare global {
  interface Window {
    snap: any;
  }
}
async function DetailOrderContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="w-full">
      <DetailOrder id={id} />
    </div>
  );
}

export default function DetailOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={null}>
      <MidtransScript />

      <DetailOrderContent params={params} />
    </Suspense>
  );
}
