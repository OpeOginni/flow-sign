import FlowSign from "../../contracts/FlowSign.cdc"

pub fun main(address: Address, userContractNftID: UInt64): UInt64 {

    let acct = getAccount(address)

    let capability = acct.getCapability<&{FlowSign.FlowSignCollectionPublic}>(FlowSign.CollectionPublicPath)

    // borrow a reference from the capability
    let collectionRef = capability.borrow()
            ?? panic("Could not borrow receiver reference")

        
    let borrowedContract = collectionRef.borrowPublicContractNFT(id: userContractNftID) ?? panic("Collection Doesn't have Contract with ID".concat(userContractNftID.toString()))

    return borrowedContract.getContractId()
}
