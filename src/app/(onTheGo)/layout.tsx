import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";

const poppins = Poppins({ weight: "600", subsets: ["latin"] });

const OnTheGoLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className="h-full ">{children}</div>;
};

export default OnTheGoLayout;
