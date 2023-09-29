import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { serverTrpc } from "@/app/_trpc/server";
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
      <div className="grid grid-rows-1 md:grid-rows-3 lg:grid-rows-4 gap-4">
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
