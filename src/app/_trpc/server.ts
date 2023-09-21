import 'server-only'
import { httpBatchLink } from '@trpc/client'

import { appRouter } from "@/server"



export const serverTrpc = appRouter.createCaller({
    links: [httpBatchLink({ url: '/api/trpc' })],
    eventServer: {
        trigger: async () => {
        }
    },
    session: { user: null }
})