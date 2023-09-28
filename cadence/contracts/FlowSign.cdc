import NonFungibleToken from "./utility/NonFungibleToken.cdc";

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
    access(all) var contractCount: UInt64

    /// Metadata Dictionaries
    ///
    access(contract) var contractById: @{UInt64: FlowSignContract}

    /// A public struct to access Contract data
    ///
    access(all) resource FlowSignContract {
        access(all) let id: UInt64

        access(self) let contractTitle: String
        access(self) let contractText: String
        access(self) let potentialSigners: [Address]
        access(self) let expirationDate: UFix64
        access(self) let neededSignerAmount: Int
        access(self) let contractCreator: Address

        access(all) let creationDate: UFix64
        access(all) var numberOfCopies: Int64

        access(all) var signers: {Address: Bool}
        access(all) var signatureCount: Int
        access(all) var valid: Bool
        init(
            contractTitle: String,
            contractText: String,
            potentialSigners: [Address],
            expirationDate: UFix64,
            neededSignerAmount: Int,
            contractCreator: Address,
        ){
            pre {
                // expirationTime > getCurrentBlock().timestamp : "Expiration date must be in the future"
                potentialSigners.length > 0 : "There must be at least one potential signer"
                neededSignerAmount >=  potentialSigners.length / 2 : "Needed Signer Amount must be more than half of the potential signers"
                potentialSigners.length >=  neededSignerAmount : "Needed Signer Amount must be less than the number of potential signers"
            }

            self.id = FlowSign.contractCount + 1
            self.contractTitle = contractTitle
            self.contractText = contractText
            self.potentialSigners = potentialSigners
            self.expirationDate = expirationDate
            self.neededSignerAmount = neededSignerAmount
            self.creationDate = getCurrentBlock().timestamp
            self.contractCreator = contractCreator

            self.valid = false
            self.signatureCount = 0
            self.signers = {}
            self.numberOfCopies = 0

            emit FlowSignContractCreated(id: self.id, creator: self.contractCreator , potentialSigners: self.potentialSigners)
            FlowSign.contractCount = FlowSign.contractCount + 1
        }

        access(contract) fun getContractCreator(): Address {return self.contractCreator}

        access(contract) fun getID(): UInt64 {return self.id}

        access(contract) fun getContractText(): String {return self.contractText}

        access(contract) fun getContractTitle(): String {return self.contractText}

        access(contract) fun getPotentialSigners(): [Address] {return self.potentialSigners}

        access(contract) fun getSigners(): {Address: Bool} {return self.signers}

        access(contract) fun getSignatureCount(): Int {return self.signatureCount}

        access(contract) fun getExpirationDate(): UFix64 {return self.expirationDate}

        access(contract) fun getContractStatus(): String {
            if(self.valid){
                return "VALID"
            } else if(self.expirationDate < getCurrentBlock().timestamp){
                return "EXPIRED"
            } else {
                return "ONGOING"
            }
        }

        access(self) fun addSigner(signer: Address){
            log("Signer Added")
            self.signers[signer] = true

            self.signatureCount = self.signatureCount + 1
        }

        access(contract) fun signContract(signer: Address) {
            pre {
                self.potentialSigners.contains(signer) : "You are not a Potential Signer"
                self.expirationDate > getCurrentBlock().timestamp : "Contract has expired"
                self.signers[signer] == nil : "Signer has already signed"
            }

            self.addSigner(signer: signer)

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

    /// A public collection interface that restricts the functions that can be borrowed in the Contract NFT
    ///
    access(all) resource interface FlowSignNFTPublic {
        access(all) fun getContractCreator(): Address
        access(all) fun getContractStatus(): String
        access(all) fun getPotentialSigners(): [Address]
        access(all) fun getContractSigners(): {Address:Bool}
        access(all) fun getContractId(): UInt64 
        access(all) fun getSignatureCount(): Int
        access(all) fun getContractText(): String
        access(all) fun getContractTitle(): String
        access(all) fun getContractExpirationDate(): UFix64

    }

    // Only owners should be able to see/use the following functions:
    // 1) signContract

    /// A FlowSign NFT
    ///
    access(all) resource NFT: NonFungibleToken.INFT, FlowSignNFTPublic {
        access(all) let id: UInt64

        access(self) let flowSignContractId: UInt64


        init(
            contractText: String,
            potentialSigners: [Address],
            expirationDate: UFix64,
            neededSignerAmount: Int,
            contractCreator: Address,
            flowSignContractID: UInt64
        ){

            self.id = self.uuid


            self.flowSignContractId = flowSignContractID

        }

        access(all) fun signContract(): {Address: Bool} {

            var flowSignContract = (&FlowSign.contractById[self.flowSignContractId] as &FlowSign.FlowSignContract?)!

            flowSignContract.signContract(signer: self.owner?.address!)
            return flowSignContract.signers
        }

        access(all) fun getContractId(): UInt64 {

            return self.flowSignContractId
        }

        access(all) fun getContractCreator(): Address {
            var flowSignContract = (&FlowSign.contractById[self.flowSignContractId] as &FlowSign.FlowSignContract?)!

            return flowSignContract.getContractCreator()
        }

        access(all) fun getContractTitle(): String {
            var flowSignContract = (&FlowSign.contractById[self.flowSignContractId] as &FlowSign.FlowSignContract?)!

            return flowSignContract.getContractTitle()
        }

        access(all) fun getContractText(): String {
            var flowSignContract = (&FlowSign.contractById[self.flowSignContractId] as &FlowSign.FlowSignContract?)!

            return flowSignContract.getContractText()
        }

        access(all) fun getContractStatus(): String {
            var flowSignContract = (&FlowSign.contractById[self.flowSignContractId] as &FlowSign.FlowSignContract?)!

            return flowSignContract.getContractStatus()
        }

        access(all) fun getContractSigners(): {Address:Bool} {
            var flowSignContract = (&FlowSign.contractById[self.flowSignContractId] as &FlowSign.FlowSignContract?)!

            return flowSignContract.getSigners()
        }

        access(all) fun getPotentialSigners(): [Address] {
            var flowSignContract = (&FlowSign.contractById[self.flowSignContractId] as &FlowSign.FlowSignContract?)!

            return flowSignContract.getPotentialSigners()
        } getSignatureCount

        access(all) fun getSignatureCount(): Int {
            var flowSignContract = (&FlowSign.contractById[self.flowSignContractId] as &FlowSign.FlowSignContract?)!

            return flowSignContract.getSignatureCount()
        } getContractExpirationDate

        access(all) fun getContractExpirationDate(): UFix64 {
            var flowSignContract = (&FlowSign.contractById[self.flowSignContractId] as &FlowSign.FlowSignContract?)!

            return flowSignContract.getExpirationDate()
        }
    }
    //------------------------------------------------------------
    // Collection
    //------------------------------------------------------------

    /// A public collection interface that allows Contract NFTs to be borrowed
    ///
    access(all) resource interface FlowSignCollectionPublic {
        access(all) fun deposit(token: @NonFungibleToken.NFT)
        access(all) fun getIDs(): [UInt64]
        access(all) fun borrowNFT(id: UInt64): &NonFungibleToken.NFT
        access(all) fun borrowPublicContractNFT(id: UInt64): &FlowSign.NFT{FlowSign.FlowSignNFTPublic}?
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
            let contractResourceId = contract.getContractId()

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

        /// borrowPublicMomentNFT gets a reference to an NFT in the collection
        ///
        access(all) fun borrowPublicContractNFT(id: UInt64): &FlowSign.NFT{FlowSign.FlowSignNFTPublic}? {
            if self.ownedNFTs[id] != nil {
                let ref = (&self.ownedNFTs[id] as auth &NonFungibleToken.NFT?)!
                return ref as! &FlowSign.NFT
            } else {
                return nil
            }
        }

        access(all) fun borrowContractNFT(id: UInt64): &FlowSign.NFT? {
            if self.ownedNFTs[id] != nil {
                let ref = (&self.ownedNFTs[id] as auth &NonFungibleToken.NFT?)!
                return ref as! &FlowSign.NFT
            } else {
                return nil
            }
        }

        /// Mint a Contract NFT
        ///
        access(all) fun createContract(
            contractTitle: String,
            contractText: String,
            potentialSigners: [Address],
            expirationDate: UFix64,
            neededSignerAmount: Int){

            let publicAccount = self.owner ?? panic("Cannot Get Public Account")

            let contractCreator = publicAccount.address

            // Appends...Just Adds
            potentialSigners.append(contractCreator)

            let newContract: @FlowSign.FlowSignContract <- create FlowSignContract(contractTitle: contractTitle,contractText: contractText, potentialSigners: potentialSigners, expirationDate: expirationDate, neededSignerAmount: neededSignerAmount, contractCreator: contractCreator)

            FlowSign.contractById[newContract.id] <-! newContract

            FlowSign.totalSupply = FlowSign.totalSupply + 1
            
            for potentialSigner in potentialSigners {
            // Each Potential Signer is Sent a Contract NFT that they can Sign and Keep for Reference of the Contract

                let participatingSignerCollection = getAccount(potentialSigner).getCapability(FlowSign.CollectionPublicPath)
                    .borrow<&{FlowSign.FlowSignCollectionPublic}>()
                    ?? panic("Could not get reference to the NFT Collection")

                let copyContract <- create NFT(contractText: contractText, potentialSigners: potentialSigners, expirationDate: expirationDate, neededSignerAmount: neededSignerAmount, contractCreator: contractCreator, flowSignContractID: FlowSign.contractCount)
                participatingSignerCollection.deposit(token: <- copyContract)

                FlowSign.totalSupply = FlowSign.totalSupply + 1
            }

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
        self.contractCount = 0
        self.contractById <- {}

        // Create an Admin resource and save it to storage
        let collection <- create Collection()
        self.account.save(<-collection, to: self.CollectionStoragePath)

        // publish a reference to the Collection in storage
        self.account.link<&{FlowSignCollectionPublic}>(self.CollectionPublicPath, target: self.CollectionStoragePath)


        // Let the world know we are here
        emit ContractInitialized()
    }

}