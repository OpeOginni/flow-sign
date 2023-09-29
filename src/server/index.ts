import { generateKeys } from "@/utils/crypto";
import { publicProcedure, router } from "./trpc";
import { eq, lt, gte, ne } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";

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
    })
})

export type AppRouter = typeof appRouter;
