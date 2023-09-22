import { mutate, config, tx, decode, send } from "@onflow/fcl";
import { adminAuthorizationFunction } from './authz-function'

// config({
//     "accessNode.api": "https://rest-testnet.onflow.org",
//     "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn"
// });

config({
    "flow.network": "local",
    "accessNode.api": "127.0.0.1:8888",
});

// Transaction to create a Flow Account for a user, fund it and return the wallet
export async function createFlowAccount(publicKey: string, initialFundingAmt: number): Promise<string> {
    const txHash = await mutate({
        cadence: `
    transaction (publicKey: String, initialFundingAmt: UFix64) {
      prepare(signer: AuthAccount) {
        let key = PublicKey(
          publicKey: publicKey.decodeHex(),
          signatureAlgorithm: SignatureAlgorithm.ECDSA_P256
        )

        let account = AuthAccount(payer: signer)

        account.keys.add(
            publicKey: key,
            hashAlgorithm: HashAlgorithm.SHA3_256,
            weight: 1000.0
        )

		if initialFundingAmt > 0.0 {
			// Get a vault to fund the new account
			let fundingProvider = signer.borrow<&FlowToken.Vault{FungibleToken.Provider}>(
					from: /storage/flowTokenVault
				)!
			// Fund the new account with the initialFundingAmount specified
			newAccount.getCapability<&FlowToken.Vault{FungibleToken.Receiver}>(
				/public/flowTokenReceiver
			).borrow()!
			.deposit(
				from: <-fundingProvider.withdraw(
					amount: initialFundingAmt
				)
			)
		}
      }
    }
    `,
        args: (arg, t) => [arg(publicKey, t.String), arg(initialFundingAmt, t.UFix64)],
        limit: 1000,
        authz: adminAuthorizationFunction,
    });

    console.log({ txHash });
    const txResult = await tx(txHash).onceExecuted();
    console.log({ txResult });
    const { events } = txResult;

    // we need to find system event `flow.AccountAdded` in list of events
    const systemEvent = events.find((event: { type: string | string[]; }) => event.type.includes("AccountAdded"));
    // then we can extract address from it
    const accountAddress = systemEvent.data.address;
    console.log({ accountAddress });
    return accountAddress
}
