"use client";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";
import Link from "next/link";

export default function Home() {
  const profile = useAuthStore((state) => state.profile);

  return (
    <div className="bg-muted flex flex-col justify-center items-center  h-screen space-y-4">
      <h1 className="text-4xl font-bold mb-4">
        Selamat Datang {profile?.name}
      </h1>
      <Link href={profile?.role === "admin" ? "/admin" : "/order"}>
        <Button className="bg-teal-500 text-white hover:bg-teal-500 hover:text-white">
          Acces Dashboard
        </Button>
      </Link>
    </div>
  );
}
