import { Suspense } from "react";
import DetailOrder from "./_components/detail-order";
import { environment } from "@/configs/environment";
import Script from "next/script";

export const metadata = {
  title: "RAS | Detail Order ",
};

async function DetailOrderContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="w-full">
      <Script
        src={`${environment.MIDTRANS_API_URL}/snap/snap.js`}
        data-client-key={environment.MIDTRANS_CLIENT_KEY}
        strategy="lazyOnload"
      />
      ;
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
      <DetailOrderContent params={params} />
    </Suspense>
  );
}
