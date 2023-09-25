

import NonFungibleToken from "./utility/NonFungibleToken.cdc";
import MetadataViews from "./utility/MetadataViews.cdc";

access(all) contract FlowSign: NonFungibleToken {

    // Contract Events
    //
    access(all) event ContractInitialized()


    // NFT Collection Events
    //
    /// Emitted when a Contract is created
    access(all) event FlowSignContractCreated(id: UInt64, creator: Address, potentialSigners: [Address])
    /// Emitted when a Contract is signed
    access(all) event ContractSigned(id: UInt64, signer: Address)
    /// Emitted when a Contract is validated (Needed number of Signers has been reached)
    access(all) event ContractValidated(id: UInt64)

    access(all) event Deposit(id: UInt64, to: Address?)
    access(all) event Withdraw(id: UInt64, from: Address?)

    /// Emmited when a Contract Copy is Deposited
    access(all) event ContractDeposited(id: UInt64, originalCopyId: UInt64, to: Address?)

    //------------------------------------------------------------
    // Named values
    //------------------------------------------------------------

    /// Named Paths
    ///
    access(all) let CollectionStoragePath: StoragePath
    access(all) let CollectionPublicPath:  PublicPath

    //------------------------------------------------------------
    // Publicly readable contract state
    //------------------------------------------------------------

    /// Entity Counts
    ///
    access(all) var totalSupply: UInt64

    /// Metadata Dictionaries
    ///

    /// A public struct to access Contract data
    ///
    access(all) resource FlowSignContract {
        access(all) let id: UInt64

        access(self) let contractText: String
        access(self) let potentialSigners: [Address]
        access(self) let expirationDate: UFix64
        access(self) let neededSignerAmount: Int64
        access(self) let contractCreator: Address

        access(all) let creationDate: UFix64
        access(all) var numberOfCopies: Int64

        access(all) var signers: {Address: Bool}
        access(all) var signatureCount: Int64
        access(all) var valid: Bool
        init(
            contractText: String,
            potentialSigners: [Address],
            expirationDate: UFix64,
            neededSignerAmount: Int64,
            contractCreator: Address,
        ){
            pre {
                expirationDate > getCurrentBlock().timestamp : "Expiration date must be in the future"
                potentialSigners.length > 0 : "There must be at least one potential signer"
                neededSignerAmount > potentialSigners.length as! Int64 / 2 : "Needed Signer Amount must be more than half of the potential signers"
            }

            self.id = self.uuid
            self.contractText = contractText
            self.potentialSigners = potentialSigners
            self.expirationDate = expirationDate + getCurrentBlock().timestamp
            self.neededSignerAmount = neededSignerAmount
            self.creationDate = getCurrentBlock().timestamp
            self.contractCreator = contractCreator

            self.valid = false
            self.signatureCount = 0
            self.signers = {}
            self.numberOfCopies = 0

            emit FlowSignContractCreated(id: self.id, creator: self.contractCreator , potentialSigners: self.potentialSigners)
        }

        access(all) fun getContractCreator(): Address {return self.contractCreator}

        access(all) fun getID(): UInt64 {return self.id}

        access(all) fun getContractText(): String {return self.contractText}

        access(all) fun getPotentialSigners(): [Address] {return self.potentialSigners}

        access(all) fun getSigners(): {Address: Bool} {return self.signers}

        access(all) fun getContractStatus(): String {
            if(self.valid){
                return "VALID"
            } else if(self.expirationDate < getCurrentBlock().timestamp){
                return "EXPIRED"
            } else {
                return "INVALID"
            }
        }

        access(all) fun signContract(signer: Address) {
            pre {
                self.expirationDate > getCurrentBlock().timestamp : "Contract has expired"
                self.signers[signer] == false : "Signer has already signed"
            }

            self.signers[signer] = true
            self.signatureCount = self.signatureCount + 1

            /// If the needed number of signers has been reached, the contract is valid
            if(self.signatureCount == self.neededSignerAmount){
                self.valid = true
                emit ContractValidated(id: self.id)
            }

            emit ContractSigned(id: self.id, signer: signer)
        }
        
    }


    //------------------------------------------------------------
    // NFT
    //------------------------------------------------------------

    /// A FlowSign NFT
    ///
    access(all) resource NFT: NonFungibleToken.INFT {
        access(all) let id: UInt64

        access(self) let FlowSignContractId: UInt64
        access(self) let Contract: @FlowSign.FlowSignContract

        init(
            contractText: String,
            potentialSigners: [Address],
            expirationDate: UFix64,
            neededSignerAmount: Int64,
            contractCreator: Address,
        ){
            pre {
                expirationDate > getCurrentBlock().timestamp : "Expiration date must be in the future"
                potentialSigners.length > 0 : "There must be at least one potential signer"
                neededSignerAmount > potentialSigners.length as! Int64 / 2 : "Needed Signer Amount must be more than half of the potential signers"
            }

            self.id = self.uuid

            self.Contract <- create FlowSignContract(
                contractText: contractText,
                potentialSigners: potentialSigners,
                expirationDate: expirationDate,
                neededSignerAmount: neededSignerAmount,
                contractCreator: contractCreator
            )

            self.FlowSignContractId = self.Contract.id

            for potentialSigner in potentialSigners {
            // Each Potential Signer is Sent a Contract NFT that they can Sign and Keep for Reference of the Contract

                let participatingSigner = getAccount(potentialSigner).getCapability(FlowSign.CollectionPublicPath)
                    .borrow<&{FlowSign.FlowSignCollectionPublic}>()
                    ?? panic("Could not get reference to the NFT Collection")

                let copyContract <- create NFT(contractText: contractText,
                                                potentialSigners: potentialSigners,
                                                expirationDate: expirationDate,
                                                neededSignerAmount: neededSignerAmount,
                                                contractCreator: self.owner?.address!
                                                )
                participatingSigner.deposit(token: <- copyContract)
            }
        }

        access(all) fun signContract() {
            self.Contract.signContract(signer: self.owner?.address!)
        }

        access(all) fun getContractResourceId(): UInt64 {
            return self.Contract.getID()
        }

        access(all) fun getContractCreator(): Address {
            return self.Contract.getContractCreator()
        }

        access(all) fun getContractText(): String {
            return self.Contract.getContractText()
        }

        access(all) fun getContractStatus(): String {
            return self.Contract.getContractStatus()
        }

        access(all) fun getContractSigners(): {Address:Bool} {
            return self.Contract.getSigners()
        }

        access(all) fun getPotentialSigners(): [Address] {
            return self.Contract.getPotentialSigners()
        }

        destroy() {
            destroy self.Contract
        }
    }
    //------------------------------------------------------------
    // Collection
    //------------------------------------------------------------

    /// A public collection interface that allows Moment NFTs to be borrowed
    ///
    pub resource interface FlowSignCollectionPublic {
        pub fun deposit(token: @NonFungibleToken.NFT)
        pub fun getIDs(): [UInt64]
        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT
    }

    /// An NFT Collection
    ///
    access(all) resource Collection: 
        FlowSignCollectionPublic,
        NonFungibleToken.Provider,
        NonFungibleToken.Receiver,
        NonFungibleToken.CollectionPublic
        {
        /// dictionary of NFT conforming tokens
        /// NFT is a resource type with an UInt64 ID field
        ///
        pub var ownedNFTs: @{UInt64: NonFungibleToken.NFT}

        init () {
          self.ownedNFTs <- {}
        }

        access(all) fun deposit(token: @NonFungibleToken.NFT) {
            let contract <- token as! @FlowSign.NFT

            let id: UInt64 = contract.id
            let contractResourceId = contract.getContractResourceId()

            // Add the new contract to the dictionary, this removes the old one
            let oldContract <- self.ownedNFTs[id] <- contract
      
            // Trigger an event to let listeners know an NFT was deposited to this collection
            emit ContractDeposited(id: id, originalCopyId: contractResourceId, to: self.owner?.address)
            emit Deposit(id: id, to: self.owner?.address)

            // Destroy (burn) the old NFT
            destroy oldContract
        } 

        /// withdraw removes an NFT from the collection and moves it to the caller
        ///
        access(all) fun withdraw(withdrawID: UInt64): @NonFungibleToken.NFT {
            let token <- self.ownedNFTs.remove(key: withdrawID) ?? panic("missing NFT")

            emit Withdraw(id: token.id, from: self.owner?.address)

            return <-token
        }

       access(all) fun borrowNFT(id: UInt64): &NonFungibleToken.NFT {
            return (&self.ownedNFTs[id] as &NonFungibleToken.NFT?)!
        }

        /// Mint a Contract NFT
        ///
        access(all) fun createContract(
            contractText: String,
            potentialSigners: [Address],
            expirationDate: UFix64,
            neededSignerAmount: Int64){

            var newContract: @FlowSign.NFT <- create NFT(contractText: contractText,
                                                         potentialSigners: potentialSigners,
                                                         expirationDate: expirationDate,
                                                         neededSignerAmount: neededSignerAmount,
                                                         contractCreator: self.owner?.address!)

            self.deposit(token: <- newContract)

            FlowSign.totalSupply = FlowSign.totalSupply + 1
        }

        access(all) fun getIDs(): [UInt64] {
            return self.ownedNFTs.keys
        }

        destroy() {
            destroy self.ownedNFTs
        }
    }

    access(all) fun createEmptyCollection(): @NonFungibleToken.Collection {
        return <- create Collection()
    }

    /// Golazos contract initializer
    ///
    init() {
        // Set the named paths
        self.CollectionStoragePath = /storage/FlowSignCollection
        self.CollectionPublicPath = /public/FlowSignCollection

        // Initialize the entity counts
        self.totalSupply = 0

        // Create an Admin resource and save it to storage
        let collection <- create Collection()
        self.account.save(<-collection, to: self.CollectionStoragePath)

        // Let the world know we are here
        emit ContractInitialized()
    }

}