import FlowSign from "../../contracts/FlowSign.cdc"

/// This script gets the NFT IDs in a User's Collection, Each of the NFTs Have a Unique Contract Resource, and Each Contract Resource can have multple NFT Copies per Unique Signer
pub fun main(address: Address): [UInt64] {

    let acct = getAccount(address)

    let capability = acct.getCapability<&{FlowSign.FlowSignCollectionPublic}>(FlowSign.CollectionPublicPath)

    // borrow a reference from the capability
    let collectionRef = capability.borrow()
            ?? panic("Could not borrow receiver reference")
        
    return collectionRef.getIDs()

}
