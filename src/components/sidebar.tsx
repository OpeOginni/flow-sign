"use client";

import Image from "next/image";
import Link from "next/link";
import { Montserrat, Poppins } from "next/font/google";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import {
  Code,
  ImageIcon,
  LayoutDashboard,
  FileCheck2,
  PenTool,
  ScrollText,
  ShieldCheck,
} from "lucide-react";

const montserrat = Montserrat({ weight: "600", subsets: ["latin"] });
const poppins = Poppins({ weight: "600", subsets: ["latin"] });

const routes = [
  {
    label: "Create Contract",
    icon: ScrollText,
    href: "/create-contract",
    color: "text-[#ac2f63]",
  },
  {
    label: "Pending Contracts",
    icon: PenTool,
    href: "/pending-contracts",
    color: "text-[#ac2f63]",
  },
  {
    label: "Verify Contract",
    icon: ShieldCheck,
    href: "/verify",
    color: "text-[#ac2f63]",
  },
];

const Sidebar = () => {
  const pathname = usePathname();
  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-[#D9EDE5] text-black">
      <div className="px-3 py-2 flex-1">
        <Link
          href="/dashboard"
          className="flex items-center pl-3 mb-14 justify-center"
        >
          <h1
            className={cn(
              "text-2xl font-bold hover:text-[#02ed8b]",
              poppins.className
            )}
          >
            Flow Sign 📜
          </h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              href={route.href}
              key={route.href}
              className={cn(
                "text-lg group flex p-5 w-full justify-start font-medium cursor-pointer hover:text-black hover:bg-[#ecd8bb] rounded-full transition",
                pathname === route.href
                  ? "text-black bg-white/10"
                  : "text-gray-500 hover:bg-[#ecd8bb]"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
