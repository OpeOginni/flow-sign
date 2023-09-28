import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ContractReadComponent from "@/components/contractTextComponent";

import { serverTrpc } from "@/app/_trpc/server";

export default async function ContractPage() {
  const session = await getServerSession(authOptions);

  const currentUserEmail = session!.user?.email!;

  const user = await serverTrpc.getUserByEmail(currentUserEmail);

  return <ContractReadComponent userAddress={user.walletAddress!} />;
}
