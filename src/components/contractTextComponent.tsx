"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getContractText } from "@/server-functions/flowSignScripts";

export default function ContractReadComponent(props: { userAddress: string }) {
  const { contractId } = useParams();

  const [contractText, setContractText] = useState<string>("");

  // Function to fetch the contract text (you can implement this)
  async function fetchContractText(contractId: string): Promise<string> {
    const contractText = await getContractText(
      props.userAddress,
      Number(contractId)
    );
    // Replace this with your logic to fetch the contract text by ID
    return contractText;
  }

  useEffect(() => {
    if (contractId) {
      // Fetch the contract text based on the contract ID
      fetchContractText(contractId as string).then((text) => {
        setContractText(text);
      });
    }
  }, [contractId]);

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

      <style jsx>{`
        /* CSS styles for the contract text */
        .contract-text {
          font-size: 16px;
          line-height: 1.5;
          text-align: justify;
        }
      `}</style>

      <div className="flex justify-center mt-4">
        {1 > 0 ? (
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mx-2">
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
        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mx-2">
          Verify
        </button>
      </div>
    </div>
  );
}
