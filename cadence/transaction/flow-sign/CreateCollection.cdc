import FlowSign from "FlowSign"
import MetadataViews from "MetadataViews"
import NonFungibleToken from "NonFungibleToken"

transaction() {

  prepare(acct: AuthAccount) {
    let d = FlowSign.resolveView(Type<MetadataViews.NFTCollectionData>())! as! MetadataViews.NFTCollectionData

    let emptyCollection <- FlowSign.createEmptyCollection()

    acct.save(<-emptyCollection, to: FlowSign.CollectionStoragePath)

    acct.link<&{FlowSign.FlowSignCollectionPublic}>(FlowSign.CollectionPublicPath, target: FlowSign.CollectionStoragePath)

    acct.unlink(d.providerPath)
    acct.link<&FlowSign.Collection{FlowSign.FlowSignCollectionPublic, NonFungibleToken.CollectionPublic, NonFungibleToken.Provider}>(d.providerPath, target: d.storagePath)
    }

  execute {
    log("Created Empty Collection")
  }
}
