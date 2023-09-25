import FlowSign from "../../contracts/FlowSign.cdc"

transaction() {

  prepare(acct: AuthAccount) {
    log(acct.address)

    let emptyCollection <- FlowSign.createEmptyCollection()

    acct.save(<-emptyCollection, to: FlowSign.CollectionStoragePath)
  }

  execute {
    log("Created Empty Collection")
  }
}
