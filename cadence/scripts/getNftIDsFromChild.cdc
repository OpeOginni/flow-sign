// This Script gets all the NFT IDs from the CCollection of the Child Account

// import HybridCustody from "HybridCustody"

// import NonFungibleToken from "NonFungibleToken"
// import MetadataViews from "MetadataViews"
// import FlowSign from "FlowSign"

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