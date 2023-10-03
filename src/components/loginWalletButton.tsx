"use client";
import * as fcl from "@onflow/fcl";

fcl.config({
  "accessNode.api": "https://rest-testnet.onflow.org",
  "discovery.wallet": `https://fcl-discovery.onflow.org/testnet/authn`,
});

export default function LoginWalletButton() {
  return (
    <div>
      <button
        onClick={async () => {
          fcl.authenticate();
        }}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Login Wallet
      </button>

      <button
        onClick={() => {
          fcl.unauthenticate();
        }}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Logout Wallet
      </button>
    </div>
  );
}
