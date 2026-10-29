import { Suspense } from "react";
import Success from "./_component/success";
export const metadata = {
  title: "RAS | Payment Success",
};

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="p-4 text-center">Loading payment status...</div>
      }
    >
      <Success />
    </Suspense>
  );
}
