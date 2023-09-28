"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { Calendar } from "./ui/calendar";
import { createContractTransaction } from "@/server-functions/flowSignTransactions";

interface ContractFormProps {
  userAddress: string;
}

interface ContractFormData {
  contractTitle: string;
  contractText: string;
  expirationDate: string;
  minSigners: number;
  signers: string[];
}

const ContractForm: React.FC<ContractFormProps> = ({ userAddress }) => {
  const [formData, setFormData] = useState<ContractFormData>({
    contractTitle: "",
    contractText: "",
    expirationDate: "",
    minSigners: 1, // Initial minimum required signers
    signers: [""], // Initial signer
  });

  const handleAddSigner = () => {
    setFormData((prevData) => ({
      ...prevData,
      signers: [...prevData.signers, ""],
    }));
  };

  const handleRemoveSigner = (index: number) => {
    setFormData((prevData) => {
      const updatedSigners = [...prevData.signers];
      updatedSigners.splice(index, 1);
      return {
        ...prevData,
        signers: updatedSigners,
      };
    });
  };

  const handleSignerChange = (index: number, value: string) => {
    setFormData((prevData) => {
      const updatedSigners = [...prevData.signers];
      updatedSigners[index] = value;
      return {
        ...prevData,
        signers: updatedSigners,
      };
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    createContract(formData, userAddress);
  };

  async function createContract(
    formData: ContractFormData,
    userAddress: string
  ) {
    const expirationDate = new Date(formData.expirationDate);

    console.log(expirationDate);

    const epochExpirationDate = expirationDate.getTime() / 1000;

    const contractID = await createContractTransaction({
      contractTitle: formData.contractTitle,
      contractText: formData.contractText,
      expirationDate: epochExpirationDate.toFixed(2),
      minSigners: formData.minSigners,
      potentialSigners: formData.signers,
      userAddress: userAddress,
    });

    console.log(formData);
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="contract-title"
            className="block text-gray-700 font-bold mb-2"
          >
            Contract Title:
          </label>
          <input
            type="text"
            id="contract-title"
            className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
            value={formData.contractTitle}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, contractTitle: e.target.value })
            }
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="contract-text"
            className="block text-gray-700 font-bold mb-2"
          >
            Contract Text:
          </label>
          <textarea
            id="contract-text"
            className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
            rows={5}
            value={formData.contractText}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setFormData({ ...formData, contractText: e.target.value })
            }
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label
            htmlFor="expiration-date"
            className="block text-gray-700 font-bold mb-2"
          >
            Contract Expiration Date:
          </label>

          <input
            type="date"
            id="expiration-date"
            className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
            value={formData.expirationDate}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, expirationDate: e.target.value })
            }
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="min-signers"
            className="block text-gray-700 font-bold mb-2"
          >
            Minimum Required Signers:
          </label>
          <input
            type="number"
            id="min-signers"
            className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
            value={formData.minSigners}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, minSigners: parseInt(e.target.value) })
            }
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Signers:</label>
          {formData.signers.map((signer, index) => (
            <div key={index} className="flex mb-2">
              <input
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                value={signer}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleSignerChange(index, e.target.value)
                }
                required
              />
              <button
                type="button"
                className="ml-2 p-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none"
                onClick={() => handleRemoveSigner(index)}
              >
                -
              </button>
            </div>
          ))}
          <button
            type="button"
            className="p-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none"
            onClick={handleAddSigner}
          >
            +
          </button>
        </div>
        <div className="mb-4">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContractForm;
