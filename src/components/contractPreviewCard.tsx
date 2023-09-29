import Link from "next/link";

import { getContractDetailsFromID } from "@/server-functions/flowSignScripts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface previewCardProps {
  ownerAddress: string;
  contractNftID: number;
}

export async function ContractPreviewCard(props: previewCardProps) {
  const contractDetails = await getContractDetailsFromID(
    props.ownerAddress,
    props.contractNftID
  );

  const formatEpochToDate = (epochTime: string) => {
    console.log(epochTime);

    const date = new Date(Number(epochTime) * 1000);
    console.log(date);
    return date.toDateString(); // This will display the date in a human-readable format
  };

  console.log(contractDetails);

  return (
    <Card className="relative w-[350px] h-[400px]">
      {/* {1 > 0 && (
        <div className="absolute top-0 right-0 bg-yellow-500 text-white py-1 px-2 rounded-tr-lg">
          Creator
        </div>
      )} */}
      <CardHeader>
        <CardTitle>{contractDetails.ContractTitle}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div
          className={cn(
            "items-center space-x-4 rounded-md border p-4 font-bold ",
            Date.now() <
              new Date(
                Number(contractDetails.ContractExpirationDate) * 1000
              ).getTime()
              ? "bg-[#02ed8b]"
              : "bg-[#ac2f63]"
          )}
        >
          <p className="text-right">
            Expiration Date:{" "}
            {formatEpochToDate(contractDetails.ContractExpirationDate)}
          </p>
        </div>
        <div
          className={
            "flex items-center justify-center text-center space-x-4 rounded-md border p-4 h-[150px] font-bold bg-[#dff6ed]"
          }
        >
          <p className="font-bold text-xl">#{props.contractNftID}</p>
        </div>

        {props.ownerAddress == contractDetails.ContractCreator && (
          <div className="absolute top-0 right-0 bg-[#ac2f63] text-white py-1 px-2 rounded-tr-lg">
            Creator
          </div>
        )}
      </CardContent>
      <CardFooter>
        <div className="flex justify-center mt-4">
          <Link href={`/contract/${props.contractNftID}`}>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mx-2">
              View
            </button>
          </Link>

          <Link href={`/verify/${props.contractNftID}`}>
            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mx-2">
              Verify
            </button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
