import * as fcl from "@onflow/fcl";

import React, { useState, useEffect } from "react";

import OnTheGoGallery from "@/components/onTheGoGalleryComponent";
import LoginWalletButton from "@/components/loginWalletButton";

export default async function OnTheGoPage() {
  let currentUser = await fcl.currentUser.snapshot();

  console.log("currentUser", currentUser);

  const unsubscribe = fcl.currentUser.subscribe((currentUser: any) => {
    console.log(currentUser);
    currentUser = currentUser;
  });

  if (currentUser.loggedIn == null) {
    <LoginWalletButton />;

    unsubscribe();
  }

  return (
    <div className="flex items-center justify-center flex-col">
      {/* <OnTheGoGallery user={signedInUser} /> */}
    </div>
  );
}
