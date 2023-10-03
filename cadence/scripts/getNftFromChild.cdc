import HybridCustody from "../contracts/hybrid-custody/HybridCustody.cdc"

import NonFungibleToken from "../contracts/NonFungibleToken.cdc"
import MetadataViews from "../contracts/MetadataViews.cdc"
import FlowSign from "../contracts/FlowSign.cdc"

// Verify that a child address borrowed as a child will let the parent borrow an NFT provider capability
pub fun main(parent: Address, child: Address) {
    let acct = getAuthAccount(parent)

    let manager = acct.borrow<&HybridCustody.Manager>(from: HybridCustody.ManagerStoragePath)
        ?? panic("manager does not exist")

    let childAcct = manager.borrowAccount(addr: child) ?? panic("child account not found")

    let nakedCap = childAcct.getCapability(path: d.providerPath, type: Type<&{NonFungibleToken.CollectionPublic}>())
        ?? panic("capability not found")

    let cap = nakedCap as! Capability<&{NonFungibleToken.CollectionPublic}>
    cap.borrow() ?? panic("unable to borrow nft provider collection")
}