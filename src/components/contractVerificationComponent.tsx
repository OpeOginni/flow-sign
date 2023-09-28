"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  getContractDetailsFromID,
  ContractDetailsData,
} from "@/server-functions/flowSignScripts";
import { signContractTransaction } from "@/server-functions/flowSignTransactions";

export default function VerifyContractComponent(props: {
  userAddress: string;
}) {
  const { contractId } = useParams();

  const [contractDetails, setContractDetails] = useState<ContractDetailsData>();
  const [contractID, setContractId] = useState<string>(props.userAddress);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function fetchContractDetails() {
    if (contractId) {
      setIsLoading(true);
      try {
        const contractDetials = await getContractDetailsFromID(
          props.userAddress,
          Number(contractId)
        );

        setContractDetails(contractDetials);
      } catch (error) {
        // Handle error (e.g., display an error message)
        console.error("Error fetching contract details:", error);
      } finally {
        setIsLoading(false);
      }
    }
  }

  const handleVerifyClick = () => {
    fetchContractDetails();
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mt-4 py-7">
        <Link className="rounded-md border p-2 bg-[#c3eede]" href="/">
          Back to Home
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-4">Verify Contract</h1>
      <div className="flex flex-col">
        <label htmlFor="contractId" className="mb-2">
          Contract ID:
        </label>
        <input
          type="text"
          id="contractId"
          className="border rounded py-2 px-3 mb-4"
          value={contractId || ""}
          onChange={(e) => setContractId(e.target.value)}
          placeholder="Enter Contract ID"
        />
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={handleVerifyClick}
          disabled={isLoading}
        >
          Verify Contract
        </button>
      </div>
      {isLoading && <div className="mt-4">Loading...</div>}
      {!isLoading && contractDetails && (
        <div className="bg-white p-4 rounded shadow mt-4">
          <h2 className="text-xl font-bold mb-2">
            {contractDetails.ContractTitle}
          </h2>
          <div
            className="contract-text"
            dangerouslySetInnerHTML={{ __html: contractDetails.ContractText }}
          />
          <p className="mt-4">
            Contract Status: {contractDetails.ContractStatus}
          </p>
        </div>
      )}
      <style jsx>{`
        /* CSS styles for the contract text */
        .contract-text {
          font-size: 16px;
          line-height: 1.5;
          text-align: justify;
        }
      `}</style>
    </div>
  );
}
