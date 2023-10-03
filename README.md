### LW3 Hackathon

## Introduction to `Flow Sign`

Flow Sign is a Dapp Built on the Flow Blockchain that lets individuals create Contracts, share them with other users to sing the contract, store contracts and verify those contract. Flow Sign tried to solve the issue of trust in the Commercial world, as Pysical Paper Contracts can be easier destroyed, these contract are minted as NFTs on the Flow Blockchain, and a copy is distributed to the Collection of everyone who is called on to sign on the contract.

## Account Abstraction and Hybrid - Custody

Flow Sign was my chance to really dig deep and test out the Account Abstraction and Hybrid - Custody feature of Flow. Users can sign up using their Gmails accouns are created for them on the backend, this makes running of transactions easier as users don't have to approve every transaction being made and users also don't have to worry about gas fees for these transactions.

Some users still would like to have the contracts on their personal Non-Custodial Wallet, this is possible thanls to Hybrid-Custody, on FlowSign users can link their Non-Custodial wallets to the wallets created for them, giving them access to their FlowSign Contracts, to Check and Verify even without logging in to the Dapp.

## Installation and Setup

- Clone this repository
- Install dependecies using `npm install`
- Create a `.env` file and useing the variables in the `.env.example` file fill in the needed Variables
- You can decide to run your local postgres docker image using the `docker-compose` file provided
- Start the development server with `npm run dev`
