import FlowSign from "../../contracts/FlowSign.cdc"

pub fun main(address: Address): [UInt64] {

    let acct = getAccount(address)

    let capability = acct.getCapability<&{FlowSign.FlowSignCollectionPublic}>(FlowSign.CollectionPublicPath)

    // borrow a reference from the capability
    let collectionRef = capability.borrow()
            ?? panic("Could not borrow receiver reference")
        
    return collectionRef.getIDs()

}
