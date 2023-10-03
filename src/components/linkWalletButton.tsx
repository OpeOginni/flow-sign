"use client";
import * as fcl from "@onflow/fcl";
import React, { useState, useEffect } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  claimChildAccount,
  publishChildAccount,
  setupChildAccount,
} from "@/utils/hybrid-custody";
import { trpc } from "@/app/_trpc/client";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

interface LinkWalletButtonProps {
  flowSignWalletAddress: string;
  flowSignWalletPrivateKey: string;
}

interface FclUserType {
  addr: string;
  loggedIn: boolean;
}

export default function LinkWalletButton(props: LinkWalletButtonProps) {
  const { toast } = useToast();

  const [user, setUser] = useState({ loggedIn: null, addr: "" });
  const [loading, setLoading] = useState<boolean>(false); // Add loading state

  const linkedWallet = trpc.updateLinkedWallet.useMutation();

  // const {data} = trpc.getCustodialWalletFromChildWallet.useQuery(props.flowSignWalletAddress)

  useEffect(() => {
    const unsubscribe = fcl.currentUser.subscribe((user: any) => setUser(user));
    return () => unsubscribe();
  }, []); // sets the callback for FCL to use

  async function walletLinking() {
    try {
      setLoading(true); // Set loading state to true while processing

      console.log(user);

      await setupChildAccount(
        props.flowSignWalletPrivateKey,
        props.flowSignWalletAddress
      );

      toast({
        title: "Child Account Created",
      });

      await publishChildAccount(
        user.addr,
        props.flowSignWalletPrivateKey,
        props.flowSignWalletAddress
      );

      toast({
        title: "Child Account Published",
      });

      await claimChildAccount(await fcl.authz, props.flowSignWalletAddress);

      toast({
        title: "Child Account Claimed",
      });

      const newUser = linkedWallet.mutate({
        accountAddress: props.flowSignWalletAddress,
        linkedCustodialAddress: user.addr,
      });

      console.log("User Updated", newUser);
    } catch (e: any) {
      console.log(e);

      return toast({
        title: "Account Linking Error",
        description: e.message,
        variant: "destructive",
      });
    }
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Link Wallet
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogDescription className="flex justify-center items-center">
            {user.loggedIn ? (
              <>
                <div className="grid grid-cols-2 gap-10">
                  {loading ? (
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      disabled
                    >
                      Linking...
                    </button>
                  ) : (
                    <button
                      onClick={async () => await walletLinking()}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Link Wallet
                    </button>
                  )}

                  <button
                    onClick={() => fcl.unauthenticate()}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Log Out Wallet
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={() => fcl.logIn()}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Login Wallet
              </button>
            )}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
