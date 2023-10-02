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

interface LinkWalletButtonProps {
  flowSignWalletAddress: string;
  flowSignWalletPrivateKey: string;
}

interface FclUserType {
  addr: string;
  loggedIn: boolean;
}

export default function LinkWalletButton(props: LinkWalletButtonProps) {
  const [user, setUser] = useState({ loggedIn: null, addr: "" });

  useEffect(() => {
    const unsubscribe = fcl.currentUser.subscribe((user: any) => setUser(user));
    return () => unsubscribe();
  }, []); // sets the callback for FCL to use

  async function walletLinking() {
    try {
      console.log(props);

      console.log(user);

      // await setupChildAccount(
      //   props.flowSignWalletPrivateKey,
      //   props.flowSignWalletAddress
      // );

      console.log("Child Account Setup");

      await publishChildAccount(
        user.addr,
        props.flowSignWalletPrivateKey,
        props.flowSignWalletAddress
      );
      console.log("Child Published");

      await claimChildAccount(await fcl.authz, props.flowSignWalletAddress);

      console.log("Child Claimed");
    } catch (e) {
      console.log(e);
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
          <DialogDescription>
            {user.loggedIn ? (
              <>
                <button
                  onClick={async () => await walletLinking()}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Link Wallet
                </button>
                <button
                  onClick={() => fcl.unauthenticate()}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Log Out Wallet
                </button>
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
