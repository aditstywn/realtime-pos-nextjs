"use client";

import Script from "next/script";
import { environment } from "@/configs/environment";

export default function MidtransScript() {
  return (
    <Script
      src={`${environment.MIDTRANS_API_URL}/snap/snap.js`}
      data-client-key={environment.MIDTRANS_CLIENT_KEY}
      strategy="lazyOnload"
    />
  );
}
