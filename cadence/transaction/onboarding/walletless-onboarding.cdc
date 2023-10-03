import FungibleToken from "FungibleToken"
import FlowToken from "FlowToken"
import FlowSign from "FlowSign"

transaction(publicKey: String, ) {
    
	
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
					amount: 2.00 // Depositing 2 Flow Per Account
				)
			)

      // Create a FlowSign Collection for the new account

      let emptyCollection <- FlowSign.createEmptyCollection()

      newAccount.save(<-emptyCollection, to: FlowSign.CollectionStoragePath)

      newAccount.link<&{FlowSign.FlowSignCollectionPublic}>(FlowSign.CollectionPublicPath, target: FlowSign.CollectionStoragePath)

      }
    }