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
            import FlowSign from 0xdf8619a80f083cff

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
    "ContractSigners": Record<string, boolean>,
    "ContractExpirationDate": string
}

export async function getContractDetailsFromID(ownerAddress: string, ownerContractNftID: number): Promise<ContractDetailsData> {

    const contractDetails: ContractDetailsData = await query({
        cadence: `
            import FlowSign from 0xdf8619a80f083cff

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
                    "ContractSigners": borrowedContract.getContractSigners(),
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
            import FlowSign from 0xdf8619a80f083cff

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
            import FlowSign from 0xdf8619a80f083cff

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
            import FlowSign from 0xdf8619a80f083cff

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
            import FlowSign from 0xdf8619a80f083cff

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

export async function getChildAccountContractNftIDs(accountAddress: string, userCustodialAddress: string): Promise<number[]> {


    const userContractNFT_IDs: number[] = await query({
        cadence: `
        import HybridCustody from 0x294e44e1ec6993c6

        import NonFungibleToken from 0x631e88ae7f1d7c20
        import MetadataViews from 0x631e88ae7f1d7c20
        import FlowSign from 0xdf8619a80f083cff
        
        // Verify that a child address borrowed as a child will let the parent borrow an NFT provider capability
        pub fun main(parent: Address, child: Address): [UInt64] {
            let acct = getAuthAccount(parent)
            let m = acct.borrow<&HybridCustody.Manager>(from: HybridCustody.ManagerStoragePath)
                ?? panic("manager does not exist")
        
            let childAcct = m.borrowAccount(addr: child) ?? panic("child account not found")
        
            let d = FlowSign.resolveView(Type<MetadataViews.NFTCollectionData>())! as! MetadataViews.NFTCollectionData
        
            let nakedCap = childAcct.getCapability(path: d.providerPath, type: Type<&{NonFungibleToken.CollectionPublic}>())
                ?? panic("capability not found")
        
            // let nakedCap = childAcct.getCapability(path: d.providerPath, type: Type<&{FlowSign.FlowSignCollectionPublic}>())
            //     ?? panic("capability not found")
        
            let cap = nakedCap as! Capability<&{NonFungibleToken.CollectionPublic}>
            let borrowed = cap.borrow() ?? panic("unable to borrow nft provider collection")
        
            return borrowed.getIDs()
        }
            `,
        args: (arg, t) => [arg(userCustodialAddress, t.Address,), arg(accountAddress, t.Address)],
        limit: 1000,
    })

    return userContractNFT_IDs
}
