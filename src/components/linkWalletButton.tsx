"use client";
import { signOut } from "next-auth/react";

export default function LinkWalletButton() {
  return (
    <div>
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Link Wallet
      </button>
    </div>
  );
}
