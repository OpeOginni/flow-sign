import FlowSign from "../../contracts/FlowSign.cdc"

transaction(contractText: String, potentialSigners: [Address] expirationDate: UFix64, neededSignerAmount: Int) {

  prepare(acct: AuthAccount) {

    let flowSignCollection = acct.borrow<&FlowSign.Collection>(from: FlowSign.CollectionStoragePath) ?? panic("Could not Borrow Collection")

    flowSignCollection.createContract(contractText: contractText, potentialSigners: potentialSigners, expirationDate: expirationDate, neededSignerAmount: neededSignerAmount)

  }

  execute {
    log("Created Contract")
  }
}
