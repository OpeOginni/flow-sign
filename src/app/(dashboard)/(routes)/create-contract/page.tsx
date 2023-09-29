import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ContractForm from "@/components/createContractForm";
import { serverTrpc } from "@/app/_trpc/server";

export default async function CreateContractPage() {
  const session = await getServerSession(authOptions);

  const currentUserEmail = session!.user?.email!;

  const user = await serverTrpc.getUserByEmail(currentUserEmail);

  return (
    <div>
      <ContractForm userAddress={user.walletAddress!} />
    </div>
  );
}
