import { Suspense } from "react";
import Dashboard from "../_components/dashboard";

export const metadata = {
  title: "WPU Cafe | Dashboard",
};

export default function DashboardPage() {
  return (
    <Suspense fallback={null}>
      <Dashboard />
    </Suspense>
  );
}
