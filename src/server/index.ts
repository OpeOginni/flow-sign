import { generateKeys } from "@/utils/crypto";
import { publicProcedure, router } from "./trpc";
import { eq, lt, gte, ne } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { z } from 'zod';

interface UpdateLinked {
    accountAddress: string;
    linkedCustodialAddress: string;
}

export const appRouter = router({
    getTodos: publicProcedure.query(async () => {
        return [10, 20, 30]
    }),
    generateKeys: publicProcedure.query(async () => {

        const { publicKey, privateKey } = await generateKeys()
        return { pubKey: publicKey, privKey: privateKey }
    }),
    getUserByEmail: publicProcedure.input(String).query(async (opts) => {
        const user = await db
            .select()
            .from(users)
            .where(eq(users.email, opts.input));
        return (user[0])
    }),
    getUserByWalletAddress: publicProcedure.input(String).query(async (opts) => {
        const user = await db
            .select()
            .from(users)
            .where(eq(users.walletAddress, opts.input));
        return (user[0])
    }),
    getChildWalletFromCustodialWallet: publicProcedure.input(String).query(async (opts) => {
        const user = await db.select().from(users).where(eq(users.linkedCustodialAddress, opts.input))

        return (user[0].walletAddress)
    }),
    updateLinkedWallet: publicProcedure.input(z.object({
        accountAddress: z.string(),
        linkedCustodialAddress: z.string()
    })).mutation(async (opts) => {

        const newUser = await db
            .update(users)
            .set({
                linkedCustodialAddress: opts.input.linkedCustodialAddress,
            })
            .where(eq(users.walletAddress, opts.input.accountAddress)).returning()
        return (newUser[0])

    })

})

export type AppRouter = typeof appRouter;
