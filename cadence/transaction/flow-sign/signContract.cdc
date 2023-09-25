import FlowSign from "../../contracts/FlowSign.cdc"

transaction(contractID: UInt64) {

  prepare(acct: AuthAccount) {


    let flowSignCollection = acct.borrow<&FlowSign.Collection>(from: FlowSign.CollectionStoragePath) ?? panic("Could not Borrow Collection")


    let flowSignContract = flowSignCollection.borrowContractNFT(id: contractID)?? panic("Could not Borrow Contract")


    let value = flowSignContract.signContract()

    log(value)

  }

  execute {
    log("Contract Signed")
  }
}
