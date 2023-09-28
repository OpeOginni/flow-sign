import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ContractReadComponent from "@/components/contractTextComponent";

import { serverTrpc } from "@/app/_trpc/server";
import VerifyContractComponent from "@/components/contractVerificationComponent";

export default async function ContractVerifyPage() {
  const session = await getServerSession(authOptions);

  const currentUserEmail = session!.user?.email!;

  const user = await serverTrpc.getUserByEmail(currentUserEmail);

  return <VerifyContractComponent userAddress={user.walletAddress!} />;
}
