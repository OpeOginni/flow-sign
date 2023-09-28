import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { serverTrpc } from "@/app/_trpc/server";
import { cn } from "@/lib/utils";
import { getUserContractIDs } from "@/server-functions/flowSignScripts";
import { ContractPreviewCard } from "@/components/contractPreviewCard";

export default async function MyContractsPage() {
  const session = await getServerSession(authOptions);

  // if (!session) {
  //   redirect("/api/auth/signin");
  // }

  const currentUserEmail = session!.user?.email!;

  const user = await serverTrpc.getUserByEmail(currentUserEmail);

  const contractIDs = await getUserContractIDs(user.walletAddress!);
  return (
    <div>
      <h1>My Contracts</h1>
      <div className="flex flex-col">
        {contractIDs.map((contractID) => {
          return (
            <div key={contractID}>
              <ContractPreviewCard
                ownerAddress={user.walletAddress!}
                contractNftID={contractID}
              />{" "}
            </div>
          );
        })}
      </div>
    </div>
  );
}
