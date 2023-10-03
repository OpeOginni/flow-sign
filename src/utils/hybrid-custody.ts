import { mutate, config, tx, decode, send } from "@onflow/fcl";
import { adminAuthorizationFunction, userAuthorizationFunction } from './authz-function'

config({
    'accessNode.api': 'https://rest-testnet.onflow.org',
    'discovery.wallet': `https://fcl-discovery.onflow.org/testnet/authn`
})


const childAccountName = "Flow Sign Child Account"
const childAccountDesc = "Child Account for the Flow Sign App"
const thumbnailURL = "https://raw.githubusercontent.com/OpeOginni/flow-sign/main/public/FlowSign.png"

export async function setupChildAccount(flowSignAccountPrivateKey: string, flowSignAccountAddress: string) {


    const txHash = await mutate({
        cadence: `
        #allowAccountLinking

        import HybridCustody from 0x294e44e1ec6993c6
        import CapabilityFactory from 0x294e44e1ec6993c6
        import CapabilityFilter from 0x294e44e1ec6993c6
        import MetadataViews from 0x631e88ae7f1d7c20
        
        transaction(name: String, desc: String, thumbnailURL: String) {
            prepare(acct: AuthAccount) {
                var acctCap = acct.getCapability<&AuthAccount>(HybridCustody.LinkedAccountPrivatePath)
                if !acctCap.check() {
                    acctCap = acct.linkAccount(HybridCustody.LinkedAccountPrivatePath)!
                }
        
                if acct.borrow<&HybridCustody.OwnedAccount>(from: HybridCustody.OwnedAccountStoragePath) == nil {
                    let ownedAccount <- HybridCustody.createOwnedAccount(acct: acctCap)
                    acct.save(<-ownedAccount, to: HybridCustody.OwnedAccountStoragePath)
                }
        
                // check that paths are all configured properly
                acct.unlink(HybridCustody.OwnedAccountPrivatePath)
                acct.link<&HybridCustody.OwnedAccount{HybridCustody.BorrowableAccount, HybridCustody.OwnedAccountPublic, MetadataViews.Resolver}>(HybridCustody.OwnedAccountPrivatePath, target: HybridCustody.OwnedAccountStoragePath)
        
                acct.unlink(HybridCustody.OwnedAccountPublicPath)
                acct.link<&HybridCustody.OwnedAccount{HybridCustody.OwnedAccountPublic, MetadataViews.Resolver}>(HybridCustody.OwnedAccountPublicPath, target: HybridCustody.OwnedAccountStoragePath)
        
                let child = acct.borrow<&HybridCustody.OwnedAccount>(from: HybridCustody.OwnedAccountStoragePath)!
        
                let thumbnail = MetadataViews.HTTPFile(url: thumbnailURL)
                let display = MetadataViews.Display(name: name, description: desc, thumbnail: thumbnail)
                child.setDisplay(display)
            }
        }
        `,
        args: (arg, t) => [arg(childAccountName, t.String), arg(childAccountDesc, t.String), arg(thumbnailURL, t.String)],
        limit: 9999,
        authz: userAuthorizationFunction(flowSignAccountPrivateKey, "0", flowSignAccountAddress)
    })

    console.log({ txHash });
    const txResult = await tx(txHash).onceExecuted();
    console.log({ txResult });
    const { events } = txResult;
    console.log(events)
}

export async function publishChildAccount(userWalletAddress: string, flowSignAccountPrivateKey: string, flowSignAccountAddress: string) {
    const txHash = await mutate({
        cadence: `
        import HybridCustody from 0x294e44e1ec6993c6
        import CapabilityFactory from 0x294e44e1ec6993c6
        import CapabilityFilter from 0x294e44e1ec6993c6
        
        transaction(parent: Address, factoryAddress: Address, filterAddress: Address) {
            prepare(acct: AuthAccount) {
                let child = acct.borrow<&HybridCustody.OwnedAccount>(from: HybridCustody.OwnedAccountStoragePath)
                    ?? panic("child account not found")
        
                let factory = getAccount(factoryAddress).getCapability<&CapabilityFactory.Manager{CapabilityFactory.Getter}>(CapabilityFactory.PublicPath)
                assert(factory.check(), message: "factory address is not configured properly")
        
                let filter = getAccount(filterAddress).getCapability<&{CapabilityFilter.Filter}>(CapabilityFilter.PublicPath)
                assert(filter.check(), message: "capability filter is not configured properly")
        
                child.publishToParent(parentAddress: parent, factory: factory, filter: filter)
            }
        }
        `,
        args: (arg, t) => [arg(userWalletAddress, t.Address), arg("0x1055970ee34ef4dc", t.Address), arg("0xe2664be06bb0fe62", t.Address)],
        limit: 1000,
        authz: userAuthorizationFunction(flowSignAccountPrivateKey, "0", flowSignAccountAddress)
    })

    console.log({ txHash });
    const txResult = await tx(txHash).onceExecuted();
    console.log({ txResult });
    console.log("Publisheddd")
}

export async function claimChildAccount(userAuthFunction: Function, childAccountAddress: string) {
    const txHash = await mutate({
        cadence: `
        import HybridCustody from 0x294e44e1ec6993c6
        import CapabilityFactory from 0x294e44e1ec6993c6
        import CapabilityFilter from 0x294e44e1ec6993c6
        import MetadataViews from 0x631e88ae7f1d7c20
        import FlowSign from 0xdf8619a80f083cff
        import NonFungibleToken from 0x631e88ae7f1d7c20

        transaction(childAddress: Address, name: String, description: String, thumbnailURL: String) {
            prepare(acct: AuthAccount) {
                if acct.borrow<&HybridCustody.Manager>(from: HybridCustody.ManagerStoragePath) == nil {
                    let m <- HybridCustody.createManager(filter: nil)
                    acct.save(<- m, to: HybridCustody.ManagerStoragePath)
        
                    acct.unlink(HybridCustody.ManagerPublicPath)
                    acct.unlink(HybridCustody.ManagerPrivatePath)
        
                    acct.link<&HybridCustody.Manager{HybridCustody.ManagerPrivate, HybridCustody.ManagerPublic}>(HybridCustody.ManagerPrivatePath, target: HybridCustody.ManagerStoragePath)
                    acct.link<&HybridCustody.Manager{HybridCustody.ManagerPublic}>(HybridCustody.ManagerPublicPath, target: HybridCustody.ManagerStoragePath)
                }
        
                let inboxName = HybridCustody.getChildAccountIdentifier(acct.address)
                let cap = acct.inbox.claim<&HybridCustody.ChildAccount{HybridCustody.AccountPrivate, HybridCustody.AccountPublic, MetadataViews.Resolver}>(inboxName, provider: childAddress)
                    ?? panic("child account cap not found")
        
                let manager = acct.borrow<&HybridCustody.Manager>(from: HybridCustody.ManagerStoragePath)
                    ?? panic("manager no found")
        
                manager.addAccount(cap: cap)
        
                let thumbnail = MetadataViews.HTTPFile(url: thumbnailURL)
                let display = MetadataViews.Display(name: name, description: description, thumbnail: thumbnail)
                manager.setChildAccountDisplay(address: childAddress, display)

                /** --- Setup parent's Flow Sign.Collection --- */
                //
                // Set up FlowSign.Collection if it doesn't exist
                if acct.borrow<&FlowSign.Collection>(from: FlowSign.CollectionStoragePath) == nil {
                    // Create a new empty collection
                    let collection <- FlowSign.createEmptyCollection()
                    // save it to the account
                    acct.save(<-collection, to: FlowSign.CollectionStoragePath)
                }
                // Check for public capabilities
                if !acct.getCapability<
                        &FlowSign.Collection{NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic, FlowSign.FlowSignCollectionPublic}
                    >(
                        FlowSign.CollectionPublicPath
                    ).check() {
                    // create a public capability for the collection
                    acct.unlink(FlowSign.CollectionPublicPath)
                    acct.link<
                        &FlowSign.Collection{NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic, FlowSign.FlowSignCollectionPublic}
                    >(
                        FlowSign.CollectionPublicPath,
                        target: FlowSign.CollectionStoragePath
                    )
                }
            }
        }
        `,
        args: (arg, t) => [arg(childAccountAddress, t.Address), arg(childAccountName, t.String), arg(childAccountDesc, t.String), arg(thumbnailURL, t.String)],
        limit: 1000,
        authz: userAuthFunction
    })

    console.log({ txHash });
    const txResult = await tx(txHash).onceExecuted();
    console.log({ txResult });
    console.log("Claimed")

}