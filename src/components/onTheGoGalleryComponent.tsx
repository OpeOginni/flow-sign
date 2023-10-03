import { trpc } from "@/app/_trpc/client";
import * as fcl from "@onflow/fcl";
import Gallery from "@/components/gallery";
import { serverTrpc } from "@/app/_trpc/server";

fcl.config({
  "accessNode.api": "https://rest-testnet.onflow.org",
  "discovery.wallet": `https://fcl-discovery.onflow.org/testnet/authn`,
});

interface UserType {
  loggedIn: boolean | null;
  addr: string;
}

export default async function OnTheGoGallery(props: { user: UserType }) {
  //   const [childWallet, setChildWallet] = useState<string | null>(null);

  //   const childWallet = trpc.getChildWalletFromCustodialWallet.useQuery(
  //     props.user.addr
  //   ).data;

  const childWallet = await serverTrpc.getChildWalletFromCustodialWallet(
    props.user.addr
  );

  console.log("Componnent");
  console.log(props.user.addr);
  console.log(childWallet);

  if (!childWallet) {
    return (
      <div>
        <p>This Wallet has not been linked yet</p>
      </div>
    );
  }

  return <Gallery addr={props.user.addr} childWallet={childWallet} />;
}
