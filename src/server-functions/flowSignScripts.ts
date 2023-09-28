"use server"

import { serverTrpc } from "@/app/_trpc/server";
import { adminAuthorizationFunction, userAuthorizationFunction } from "@/utils/authz-function";
import { mutate, config, tx, query } from "@onflow/fcl";
import { boolean } from "drizzle-orm/mysql-core";

config({
    'accessNode.api': 'https://rest-testnet.onflow.org',
    'discovery.wallet': `https://fcl-discovery.onflow.org/testnet/authn`
})



export async function getUserContractIDs(userAddress: string): Promise<[number]> {

    const availableIDs: [number] = await query({
        cadence: `
            import FlowSign from 0xb7b7736e23079590

            /// This script gets the NFT IDs in a User's Collection, Each of the NFTs Have a Unique Contract Resource, and Each Contract Resource can have multple NFT Copies per Unique Signer
            pub fun main(address: Address): [UInt64] {
            
                let acct = getAccount(address)
            
                let capability = acct.getCapability<&{FlowSign.FlowSignCollectionPublic}>(FlowSign.CollectionPublicPath)
            
                // borrow a reference from the capability
                let collectionRef = capability.borrow()
                        ?? panic("Could not borrow receiver reference")
                    
                return collectionRef.getIDs()
            
            } 
            `,
        args: (arg, t) => [arg(userAddress, t.Address)],
        limit: 1000,
    })

    return availableIDs

}

export interface ContractDetailsData {
    "ContractTitle": string,
    "ContractCreator": string,
    "ContractText": string,
    "ContractStatus": string,
    "ContractPotentialSigners": [number],
    "ContractSigners": [{ string: boolean }],
    "ContractExpirationDate": string
}

export async function getContractDetailsFromID(ownerAddress: string, ownerContractNftID: number): Promise<ContractDetailsData> {

    const contractDetails: ContractDetailsData = await query({
        cadence: `
            import FlowSign from 0xb7b7736e23079590

            pub fun main(address: Address, userContractNftID: UInt64): {String: AnyStruct} {

                let acct = getAccount(address)
            
                let capability = acct.getCapability<&{FlowSign.FlowSignCollectionPublic}>(FlowSign.CollectionPublicPath)
            
                // borrow a reference from the capability
                let collectionRef = capability.borrow()
                        ?? panic("Could not borrow receiver reference")
            
                    
                let borrowedContract = collectionRef.borrowPublicContractNFT(id: userContractNftID) ?? panic("Collection Doesn't have Contract with ID".concat(userContractNftID.toString()))
            
                let contractDetails: {String: AnyStruct} = {
                    "ContractTitle": borrowedContract.getContractTitle(),
                    "ContractCreator": borrowedContract.getContractCreator(),
                    "ContractText": borrowedContract.getContractText(),
                    "ContractStatus": borrowedContract.getContractStatus(),
                    "ContractPotentialSigners": borrowedContract.getPotentialSigners(),
                    "ContractSigners": borrowedContract.getPotentialSigners(),
                    "ContractExpirationDate": borrowedContract.getContractExpirationDate()            }
            
                return contractDetails
            }
            
            `,
        args: (arg, t) => [arg(ownerAddress, t.Address,), arg(ownerContractNftID.toString(), t.UInt64)],
        limit: 1000,
    })

    return contractDetails
}

export async function getContractStatus(ownerAddress: string, ownerContractNftID: number): Promise<string> {

    const contractStatus: string = await query({
        cadence: `
            import FlowSign from 0xb7b7736e23079590

            pub fun main(address: Address, userContractNftID: UInt64): String {

                let acct = getAccount(address)
            
                let potentialSigners: [Address] = [0x05, 0x06]
            
                let capability = acct.getCapability<&{FlowSign.FlowSignCollectionPublic}>(FlowSign.CollectionPublicPath)
            
                // borrow a reference from the capability
                let collectionRef = capability.borrow()
                        ?? panic("Could not borrow receiver reference")
            
                    
                let borrowedContract = collectionRef.borrowPublicContractNFT(id: userContractNftID) ?? panic("Collection Doesn't have Contract with ID".concat(contractID.toString()))
            
                return borrowedContract.getContractStatus()
            }  
            `,
        args: (arg, t) => [arg(ownerAddress, t.Address,), arg(ownerContractNftID.toString(), t.UInt64)],
        limit: 1000,
    })

    return contractStatus
}

export async function getContractSignatureCount(ownerAddress: string, ownerContractNftID: number): Promise<number> {

    const contractSignatureCount: number = await query({
        cadence: `
            import FlowSign from 0xb7b7736e23079590

            pub fun main(address: Address, userContractNftID: UInt64): Int {

                let acct = getAccount(address)
            
                let capability = acct.getCapability<&{FlowSign.FlowSignCollectionPublic}>(FlowSign.CollectionPublicPath)
            
                // borrow a reference from the capability
                let collectionRef = capability.borrow()
                        ?? panic("Could not borrow receiver reference")
            
                    
                let borrowedContract = collectionRef.borrowPublicContractNFT(id: userContractNftID) ?? panic("Collection Doesn't have Contract with ID".concat(userContractNftID.toString()))
            
                return borrowedContract.getSignatureCount()
            }
            `,
        args: (arg, t) => [arg(ownerAddress, t.Address,), arg(ownerContractNftID.toString(), t.UInt64)],
        limit: 1000,
    })

    return contractSignatureCount
}

export async function getContractText(ownerAddress: string, ownerContractNftID: number): Promise<string> {

    const contractText: string = await query({
        cadence: `
            import FlowSign from 0xb7b7736e23079590

            pub fun main(address: Address, userContractNftID: UInt64): String {

                let acct = getAccount(address)
            
                let capability = acct.getCapability<&{FlowSign.FlowSignCollectionPublic}>(FlowSign.CollectionPublicPath)
            
                // borrow a reference from the capability
                let collectionRef = capability.borrow()
                        ?? panic("Could not borrow receiver reference")
            
                    
                let borrowedContract = collectionRef.borrowPublicContractNFT(id: userContractNftID) ?? panic("Collection Doesn't have Contract with ID".concat(userContractNftID.toString()))
            
                return borrowedContract.getContractText()
            }
            `,
        args: (arg, t) => [arg(ownerAddress, t.Address,), arg(ownerContractNftID.toString(), t.UInt64)],
        limit: 1000,
    })

    return contractText
}

export async function getContractSigners(ownerAddress: string, ownerContractNftID: number): Promise<Record<string, boolean>> {

    const contractSignatures: Record<string, boolean> = await query({
        cadence: `
            import FlowSign from 0xb7b7736e23079590

            pub fun main(address: Address, userContractNftID: UInt64): {Address: Bool} {

                let acct = getAccount(address)
            
                let capability = acct.getCapability<&{FlowSign.FlowSignCollectionPublic}>(FlowSign.CollectionPublicPath)
            
                // borrow a reference from the capability
                let collectionRef = capability.borrow()
                        ?? panic("Could not borrow receiver reference")
            
                    
                let borrowedContract = collectionRef.borrowPublicContractNFT(id: userContractNftID) ?? panic("Collection Doesn't have Contract with ID".concat(userContractNftID.toString()))
            
                return borrowedContract.getContractSigners()
            }
            `,
        args: (arg, t) => [arg(ownerAddress, t.Address,), arg(ownerContractNftID.toString(), t.UInt64)],
        limit: 1000,
    })

    return contractSignatures
}
