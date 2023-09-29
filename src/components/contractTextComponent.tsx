"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  getContractSignatureCount,
  getContractSigners,
  getContractText,
} from "@/server-functions/flowSignScripts";
import { signContractTransaction } from "@/server-functions/flowSignTransactions";

export default function ContractReadComponent(props: { userAddress: string }) {
  const { contractId } = useParams();

  const [contractText, setContractText] = useState<string>("");
  const [contractSignatureCount, setContractSignatureCount] =
    useState<number>(0);
  const [contractSignatures, setContractSignatures] = useState<
    Record<string, boolean>
  >({});

  async function signContract(contractID: number, userAddress: string) {
    const signer = await signContractTransaction({
      contractID: contractID,
      userAddress: userAddress,
    });

    console.log(signer);
  }

  useEffect(() => {
    if (contractId) {
      async function fetchContractText(contractId: string): Promise<{
        contractText: String;
        contractSignatureCount: number;
        contractSignatures: Record<string, boolean>;
      }> {
        const contractSignatureCount = await getContractSignatureCount(
          props.userAddress,
          Number(contractId)
        );

        const contractSignatures = await getContractSigners(
          props.userAddress,
          Number(contractId)
        );

        const contractText = await getContractText(
          props.userAddress,
          Number(contractId)
        );
        // Replace this with your logic to fetch the contract text by ID
        return { contractText, contractSignatureCount, contractSignatures };
      }

      // Fetch the contract text based on the contract ID
      fetchContractText(contractId as string).then((contract) => {
        setContractText(contract.contractText as string);
        setContractSignatureCount(contract.contractSignatureCount);
        setContractSignatures(contract.contractSignatures);
      });
    }
  }, [contractId, props.userAddress]);

  return (
    <div className="container mx-auto p-4">
      <div className="mt-4 py-7">
        <Link className="rounded-md border p-2 bg-[#c3eede]" href="/">
          Back to Home
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-4">Contract Text</h1>
      <div className="bg-white p-4 rounded shadow">
        {/* Use CSS styles for formatting */}
        <div
          className="contract-text"
          dangerouslySetInnerHTML={{ __html: contractText }}
        />
      </div>

      <p className="mt-4">Contract Signature Count: {contractSignatureCount}</p>

      <style jsx>{`
        /* CSS styles for the contract text */
        .contract-text {
          font-size: 16px;
          line-height: 1.5;
          text-align: justify;
        }
      `}</style>

      <div className="flex justify-center mt-4">
        {!contractSignatures.hasOwnProperty(props.userAddress) ? (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mx-2"
            onClick={() => signContract(Number(contractId), props.userAddress)}
          >
            Sign
          </button>
        ) : (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mx-2"
            disabled
          >
            Already Signed
          </button>
        )}
        <Link href={`/verify/${contractId}`}>
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mx-2">
            Verify
          </button>
        </Link>
      </div>
    </div>
  );
}
