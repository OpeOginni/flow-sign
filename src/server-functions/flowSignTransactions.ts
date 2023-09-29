"use server"

import { serverTrpc } from "@/app/_trpc/server";
import { adminAuthorizationFunction, userAuthorizationFunction } from "@/utils/authz-function";
import { mutate, config, tx, } from "@onflow/fcl";

config({
    'accessNode.api': 'https://rest-testnet.onflow.org',
    'discovery.wallet': `https://fcl-discovery.onflow.org/testnet/authn`
})

interface ContractCreationData {
    contractTitle: string,
    contractText: string,
    potentialSigners: string[],
    expirationDate: string,
    minSigners: number
    userAddress: string
}

export async function createContractTransaction(creationDetials: ContractCreationData) {

    const user = await serverTrpc.getUserByWalletAddress(creationDetials.userAddress)

    try {

        const txHash = await mutate({
            cadence: `
import FlowSign from 0xb7b7736e23079590

 transaction(contractTitle: String, contractText: String, potentialSigners: [Address], expirationDate: UFix64, neededSignerAmount: Int) {
//    transaction(contractText: String) {
    prepare(acct: AuthAccount) {

    acct.link<&{FlowSign.FlowSignCollectionPublic}>(FlowSign.CollectionPublicPath, target: FlowSign.CollectionStoragePath)


    let flowSignCollection = acct.borrow<&FlowSign.Collection>(from: FlowSign.CollectionStoragePath) ?? panic("Could not Borrow Collection")

    flowSignCollection.createContract(contractTitle: contractTitle, contractText: contractText, potentialSigners: potentialSigners, expirationDate: expirationDate, neededSignerAmount: neededSignerAmount)

  }
}
`,
            args: (arg, t) => [arg(creationDetials.contractTitle, t.String), arg(creationDetials.contractText, t.String), arg(creationDetials.potentialSigners, t.Array(t.Address)),
            arg(creationDetials.expirationDate, t.UFix64), arg(creationDetials.minSigners.toString(), t.Int)],
            limit: 1000,
            payer: adminAuthorizationFunction,
            proposer: userAuthorizationFunction(user.accountPrivKey!, "0", user.walletAddress!),
            authorizations: [userAuthorizationFunction(user.accountPrivKey!, "0", user.walletAddress!)],
        });

        console.log({ txHash });
        const txResult = await tx(txHash).onceExecuted();
        console.log({ txResult });
        const { events } = txResult;


        // we need to find system event `flow.AccountCreated` in list of events
        const systemEvent = events.find((event: { type: string; }) => event.type.includes("FlowSignContractCreated"));

        // then we can extract address from it
        const contractID = systemEvent.data.id;

        return contractID
    } catch (e) {
        console.log(e)
    }
}

interface ContractSigningData {
    contractID: number
    userAddress: string
}

export async function signContractTransaction(signingDetails: ContractSigningData) {

    const user = await serverTrpc.getUserByWalletAddress(signingDetails.userAddress)

    try {

        const txHash = await mutate({
            cadence: `
import FlowSign from 0xb7b7736e23079590

transaction(contractID: UInt64) {

    prepare(acct: AuthAccount) {
  
  
      let flowSignCollection = acct.borrow<&FlowSign.Collection>(from: FlowSign.CollectionStoragePath) ?? panic("Could not Borrow Collection")
  
  
      let flowSignContract = flowSignCollection.borrowContractNFT(id: contractID)?? panic("Could not Borrow Contract")
  
  
      let value = flowSignContract.signContract()
  
  
    }
}
`,
            args: (arg, t) => [arg(signingDetails.contractID.toString(), t.UInt64)],
            limit: 1000,
            payer: adminAuthorizationFunction,
            proposer: userAuthorizationFunction(user.accountPrivKey!, "0", user.walletAddress!),
            authorizations: [userAuthorizationFunction(user.accountPrivKey!, "0", user.walletAddress!)],
        });

        console.log({ txHash });
        const txResult = await tx(txHash).onceExecuted();
        console.log({ txResult });
        const { events } = txResult;


        // we need to find system event `flow.AccountCreated` in list of events
        const systemEvent = events.find((event: { type: string; }) => event.type.includes("ContractSigned"));

        // then we can extract address from it
        const signer = systemEvent.data.signer;

        return signer
    } catch (e) {
        console.log(e)
    }
}