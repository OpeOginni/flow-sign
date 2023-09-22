"use server"

import { sign } from '../utils/crypto'

export async function getAdminSignature(message: any) {
    const adminPrivateKey = process.env.ADMIN_PRIVATE_KEY_HEX!

    const signature = await sign(message, adminPrivateKey)

    return {
        signature,
    }
}

export async function getUserSignature(message: any, userPrivateKey: string) {
    const signature = await sign(message, userPrivateKey)

    return {
        signature,
    }
}

export async function getPayerSignature(message: any,) {
    const adminPrivateKey = process.env.ADMIN_PRIVATE_KEY_HEX!

    const signature = await sign(message, adminPrivateKey)

    return {
        signature,
    }
}
