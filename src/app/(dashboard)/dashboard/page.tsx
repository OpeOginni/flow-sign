import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { trpc } from "@/app/_trpc/client";
import SignOutButton from "@/components/signOutButton";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { serverTrpc } from "@/app/_trpc/server";
export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin");
  }

  const currentUserEmail = session.user?.email!;

  const user = await serverTrpc.getUserByEmail(currentUserEmail);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      Dashboard
      <div>Welcome {user.name}</div>
      <div>Wallet: {user.walletAddress}</div>
      <SignOutButton />
    </main>
  );
}
