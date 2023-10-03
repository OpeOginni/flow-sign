# Flow Sign - A Dapp for Contract Management on the Flow Blockchain

## Introduction

Flow Sign is a decentralized application (Dapp) built on the Flow Blockchain, designed to facilitate contract creation, sharing, storage, and verification. In a world where trust is paramount in commercial transactions, Flow Sign offers a secure and efficient solution by converting contracts into non-fungible tokens (NFTs) on the Flow Blockchain. Copies of these contracts are distributed to all parties involved in the contract, ensuring transparency and immutability.

## Features

### Account Abstraction and Hybrid-Custody

Flow Sign incorporates advanced features like Account Abstraction and Hybrid-Custody, enhancing the user experience and security.

#### Account Abstraction

Users can easily sign up using their Gmail accounts, and Flow Sign automatically creates accounts for them on the backend. This streamlines the transaction process, as users do not need to approve each individual transaction, eliminating the need for constant user interaction. Additionally, users are relieved from worrying about gas fees, making Flow Sign more user-friendly.

#### Hybrid-Custody

For users who prefer to have contracts stored on their personal non-custodial wallets, Flow Sign provides the option of Hybrid-Custody. Users can link their non-custodial wallets to the wallets created for them on Flow Sign. This grants them access to their Flow Sign contracts, enabling them to check and verify contracts even without logging into the Dapp.

## Installation and Setup

Follow these steps to set up Flow Sign on your local environment:

1. Clone this repository:

   ```shell
   git clone https://github.com/OpeOginni/flow-sign.git
   ```

2. Install dependencies:

   ```shell
   npm install
   ```

3. Create a `.env` file and fill in the required variables using the template in `.env.example`.
4. Optionally, you can run a local PostgreSQL database using the provided docker-compose file:

   ```shell
   docker-compose up -d
   ```

5. Start the development server:

   ```shell
   npm run dev
   ```

   Now, Flow Sign should be up and running on your local machine.

### Contribution

Contributions to Flow Sig are welcomen. Feel free to open issues, submit pull requests, or suggest new features. Together, we can make Flow Sign even better!
