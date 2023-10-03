import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from 'next-auth/providers/github'
import type { NextAuthOptions } from 'next-auth'
import dotenv from "dotenv";
import { eq } from "drizzle-orm";

import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db";
import { users } from "@/db/schema";
import { generateKeys } from "@/utils/crypto";
import { createFlowAccount } from "@/utils/onboarding";

dotenv.config();

const DZZLEAdapter = DrizzleAdapter(db)
export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    adapter: {
        ...DZZLEAdapter,
        createUser: async (user) => {

            // Using non-null assertion as according to NextAuth this method is requried.  
            const createdUser = await DZZLEAdapter.createUser!(user)


            // Run whatever callbacks you want here
            const generatedKeys = await generateKeys()

            const walletAddress = await createFlowAccount(generatedKeys.publicKey)

            const updatedCreatedUser = await db
                .update(users)
                .set({
                    accountPrivKey: generatedKeys.privateKey,
                    accountPubKey: generatedKeys.publicKey,
                    walletAddress: walletAddress
                })
                .where(eq(users.id, createdUser.id)).returning()

            return updatedCreatedUser[0];


        }
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
    ],
    callbacks: {


    }
}


const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }