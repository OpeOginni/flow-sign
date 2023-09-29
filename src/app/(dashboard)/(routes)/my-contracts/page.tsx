import { getServerSession } from "next-auth";
import { Ghost } from "lucide-react";

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

  if (contractIDs.length < 1) {
    return (
      <div className=" inset-0 flex flex-col items-center justify-center bg-transparent p-20">
        <Ghost className="text-[#ac2f63]" />
        <p className="text-lg font-semibold text-[#ac2f63]">
          Looks Quiet Around Here
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center flex-col">
      <h1 className="text-lg p-7 font-bold">My Contracts</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {contractIDs.map((contractID) => {
          return (
            <ContractPreviewCard
              key={contractID}
              ownerAddress={user.walletAddress!}
              contractNftID={contractID}
            />
          );
        })}
      </div>
    </div>
  );
}
