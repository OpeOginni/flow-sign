import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";

const poppins = Poppins({ weight: "600", subsets: ["latin"] });

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full relative">
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-900">
        <Sidebar />
      </div>
      <main className={cn("md:pl-72", poppins.className)}>
        <Navbar />
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
