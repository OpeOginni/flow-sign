import fcl from "@onflow/fcl";
import { ec as EC } from "elliptic";
import { publicKeyCreate } from "secp256k1";
import { SHA3 } from "sha3";

const p256 = new EC("p256");

export async function generateKeys() {
    const newKeyPair = p256.genKeyPair();

    const privateKey = newKeyPair.getPrivate().toString("hex");
    const publicKeyEC = newKeyPair.getPublic();

    const pkX = publicKeyEC.getX().toString("hex");
    const pkY = publicKeyEC.getY().toString("hex");

    const publicKeyXY = `${pkX}${pkY}`;
    const publicKey =
        publicKeyXY.length % 2 === 1 ? `0${publicKeyXY}` : publicKeyXY;

    return {
        privateKey: privateKey,
        publicKey: publicKey,
    };
}
