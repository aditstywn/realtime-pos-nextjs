import { DarkModeToggle } from "@/components/common/darkmode-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-muted flex flex-col justify-center items-center  h-screen space-y-4">
      <h1 className="text-4xl font-bold mb-4">
        Selamat Datang di Realtime POS
      </h1>
      <Link href="/admin">
        <Button className="bg-teal-500 text-white hover:bg-teal-500 hover:text-white">
          Acces Dashboard
        </Button>
      </Link>
    </div>
  );
}
