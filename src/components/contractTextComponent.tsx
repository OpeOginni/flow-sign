"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { RotateCw } from "lucide-react";

import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import {
  getContractSignatureCount,
  getContractSigners,
  getContractText,
} from "@/server-functions/flowSignScripts";
import { signContractTransaction } from "@/server-functions/flowSignTransactions";

export default function ContractReadComponent(props: { userAddress: string }) {
  const { contractId } = useParams();
  const { toast } = useToast();

  const [contractText, setContractText] = useState<string>("");
  const [contractSignatureCount, setContractSignatureCount] =
    useState<number>(0);
  const [contractSignatures, setContractSignatures] = useState<
    Record<string, boolean>
  >({});
  const [loading, setLoading] = useState<boolean>(true);
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);

  async function signContract(contractID: number, userAddress: string) {
    setButtonLoading(true);
    try {
      const signer = await signContractTransaction({
        contractID: contractID,
        userAddress: userAddress,
      });

      console.log(signer);

      setButtonLoading(false);

      return toast({
        title: "Contract Signed",
        description: "Check Pending Contracts",
        action: (
          <ToastAction altText="Verify">
            <Link href={`/verify/${contractID}`}>Verify Contract</Link>
          </ToastAction>
        ),
      });
    } catch (e: any) {
      console.log(e);

      setButtonLoading(false);

      return toast({
        title: "Contract Singing Error",
        description: e.message,
        variant: "destructive",
      });
    }
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

        setLoading(false);
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
        <Link className="rounded-md border p-2 bg-[#c3eede]" href="/dashboard">
          Back to Home
        </Link>
      </div>
      {loading ? ( // Show spinner while loading
        <div className="flex justify-center items-center h-32">
          <RotateCw className="animate-spin text-blue-500 text-4xl" />
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-4">Contract Text</h1>
          <div className="bg-white p-4 rounded shadow">
            {/* Use CSS styles for formatting */}
            <div
              className="contract-text"
              dangerouslySetInnerHTML={{ __html: contractText }}
            />
          </div>

          <p className="mt-4">
            Contract Signature Count: {contractSignatureCount}
          </p>

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
              <div>
                {buttonLoading ? (
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mx-2"
                    disabled
                  >
                    Signing...
                  </button>
                ) : (
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mx-2"
                    onClick={() =>
                      signContract(Number(contractId), props.userAddress)
                    }
                  >
                    Sign
                  </button>
                )}
              </div>
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
        </>
      )}
    </div>
  );
}
