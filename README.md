# Flow Sign - A Dapp for Contract Management on the Flow Blockchain

## Introduction

Flow Sign is a decentralized application (Dapp) built on the Flow Blockchain, designed to facilitate contract creation, sharing, storage, and verification. In a world where trust is paramount in commercial transactions, Flow Sign offers a secure and efficient solution by converting contracts into non-fungible tokens (NFTs) on the Flow Blockchain. Copies of these contracts are distributed to all parties involved in the contract, ensuring transparency and immutability.

## Features

- **Walletless SignIn**: Users only need a Google Mail to SignIn.
- **Account Abstraction**: Users do not need to worry about Gas Fees and Manually Approving Transactions.
- **Hybrid Custody**: Users can easily Link their Non-Custodial wallets to their FlowSign Account Wallets, granting them access to all their Contract NFTs.
- **Smooth and Mobile Responsive Frontend**

### Account Abstraction and Hybrid-Custody

Flow Sign incorporates advanced features like Account Abstraction and Hybrid-Custody, enhancing the user experience and security.

#### Account Abstraction

Users can easily sign up using their Gmail accounts, and Flow Sign automatically creates accounts for them on the backend. This streamlines the transaction process, as users do not need to approve each individual transaction, eliminating the need for constant user interaction. Additionally, users are relieved from worrying about gas fees, making Flow Sign more user-friendly.

- [NextAuth function that creates Account Wallets for Users During SignUp](https://github.com/OpeOginni/flow-sign/blob/main/src/app/api/auth/%5B...nextauth%5D/route.ts#L21)
- [Onboarding Function](https://github.com/OpeOginni/flow-sign/blob/main/src/utils/onboarding.ts)
- [Authorization Functions (Helped with Signing Admin and User Transactions Automatically)](https://github.com/OpeOginni/flow-sign/blob/main/src/utils/authz-function.ts)

#### Hybrid-Custody

For users who prefer to have contracts stored on their personal non-custodial wallets, Flow Sign provides the option of Hybrid-Custody. Users can link their non-custodial wallets to the wallets created for them on Flow Sign. This grants them access to their Flow Sign contracts, enabling them to check and verify contracts even without logging into the Dapp.

![User FlowSign Account](/public/User_FlowSign_Account.png)

Result after a User has Linked his Account

![User Personal Account](/public/User_Personal_Account.png)

- [FlowSign Hybrid-Custody functions](https://github.com/OpeOginni/flow-sign/blob/main/src/utils/hybrid-custody.ts)

#### Scripts and Transactions

- All Run Scripts are in the file: [src/server-functions/flowSignScripts.ts](https://github.com/OpeOginni/flow-sign/blob/main/src/server-functions/flowSignScripts.ts)
- All Run Transactions are in the file: [src/server-functions/flowSignTransactions.ts](https://github.com/OpeOginni/flow-sign/blob/main/src/server-functions/flowSignTransactions.ts)

#### Cadence

Cadence is the language used to write Contracts on Flow and it is the very Backbone of this Project. All Cadence Codes, for contracts, scripts, and transactions that I used for testing and for the final product are linked below:

- [Contracts](https://github.com/OpeOginni/flow-sign/tree/main/cadence/contracts)
- [Transactions](https://github.com/OpeOginni/flow-sign/tree/main/cadence/transaction)
- [Scripts](https://github.com/OpeOginni/flow-sign/tree/main/cadence/scripts)

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

### Tech Used

- NextJS
- TailwindCSS
- ShadcnUI
- PostgreSQL
- Drizzle ORM
- TRPC
- NextAuth
- Flow & @onflow/fcl

### Contribution

Contributions to Flow Sig are welcomen. Feel free to open issues, submit pull requests, or suggest new features. Together, we can make Flow Sign even better!
