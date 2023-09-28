import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { serverTrpc } from "@/app/_trpc/server";
import { cn } from "@/lib/utils";
import LinkWalletButton from "@/components/linkWalletButton";
export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  // if (!session) {
  //   redirect("/api/auth/signin");
  // }

  const currentUserEmail = session!.user?.email!;

  const user = await serverTrpc.getUserByEmail(currentUserEmail);

  return (
    <div className="flex items-center justify-center flex-col">
      <div className="p-10">
        <h1 className={cn("text-xl")}>Welcome {user.name} to Flow Sign</h1>
      </div>
      <div className=" w-3/4 pt-4 pb-9">
        <h1 className={cn("text-md")}>
          Create Secure Contracts and Send for others to Sign, unlike normal
          peice of paper, this contract is stored on the{" "}
          <span className="hover:text-[#02ed8b] transition">
            Flow Blockchain
          </span>{" "}
          and is kept in the wallet of every signer
        </h1>
      </div>

      <div className="flex w-3/4 pt-4 pb-9 items-center justify-center flex-col">
        <h1 className={cn("text-md pb-4")}>
          You can always link a Non-Custodial Wallet and get all your Contracts
          on your personal wallet
        </h1>
        <LinkWalletButton />
      </div>
    </div>
  );
}
