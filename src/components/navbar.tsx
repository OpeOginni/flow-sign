import { redirect } from "next/navigation";

import MobileSidebar from "@/components/mobile-sidebar";
import { getServerSession } from "next-auth";
import SignOutButton from "@/components/signOutButton";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { serverTrpc } from "@/app/_trpc/server";
const Navbar = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <div className="flex items-center p-4">
      <MobileSidebar />
      <div className="flex w-full justify-end">
        <div className="grid grid-cols-2 gap-5">
          <SignOutButton />
          <SignOutButton />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
