import { mutate, config, tx, decode, send } from "@onflow/fcl";
import { adminAuthorizationFunction } from './authz-function'

config({
    'accessNode.api': 'https://rest-testnet.onflow.org',
    'discovery.wallet': `https://fcl-discovery.onflow.org/testnet/authn`
})

// config({
//     "flow.network": "local",
//     "accessNode.api": "127.0.0.1:8888",
// });

// Transaction to create a Flow Account for a user, fund it and return the wallet
export async function createFlowAccount(publicKey: string): Promise<string> {
    const txHash = await mutate({
        cadence: `
    import FungibleToken from 0x9a0766d93b6608b7
    import FlowToken from 0x7e60df042a9c0868
    transaction (publicKey: String, ) {
      prepare(signer: AuthAccount) {
        let key = PublicKey(
          publicKey: publicKey.decodeHex(),
          signatureAlgorithm: SignatureAlgorithm.ECDSA_P256
        )

        let newAccount = AuthAccount(payer: signer)

        newAccount.keys.add(
            publicKey: key,
            hashAlgorithm: HashAlgorithm.SHA3_256,
            weight: 1000.0
        )

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
					amount: 5.00 // Depositing 5Flow Per Account
				)
			)
      }
    }
    `,
        args: (arg, t) => [arg(publicKey, t.String)],
        limit: 1000,
        authz: adminAuthorizationFunction,
    });

    console.log({ txHash });
    const txResult = await tx(txHash).onceExecuted();
    console.log({ txResult });
    const { events } = txResult;


    // we need to find system event `flow.AccountCreated` in list of events
    const systemEvent = events.find((event: { type: string; }) => event.type.includes("AccountCreated"));

    // then we can extract address from it
    const accountAddress = systemEvent.data.address;
    return accountAddress
}
