// "use client";
import { getChildAccountContractNftIDs } from "@/server-functions/flowSignScripts";
import { Ghost } from "lucide-react";
import { ContractPreviewCard } from "@/components/contractPreviewCard";

export default async function Gallery(props: {
  addr: string;
  childWallet: string;
}) {
  //   const [contractIDs, setContractIDs] = useState<number[]>([]);
  //   const [loading, isLoading] = useState<boolean>(false);

  const ids = await getChildAccountContractNftIDs(
    props.childWallet,
    props.addr
  );

  //   useEffect(() => {
  //     isLoading(true);
  //     if (dataFetchedRef.current) return;
  //     dataFetchedRef.current = true;

  //     const fetchContractIDs = async () => {
  //       const ids = await getChildAccountContractNftIDs(
  //         props.childWallet,
  //         props.addr
  //       );

  //       console.log("ids", ids);
  //       setContractIDs(ids);

  //       isLoading(false);
  //     };

  //     fetchContractIDs();
  //   }, []);

  if (ids.length < 1) {
    return (
      <div className="inset-0 flex flex-col items-center justify-center bg-transparent p-20">
        <Ghost className="text-[#ac2f63]" />
        <p className="text-lg font-semibold text-[#ac2f63]">
          Looks Quiet Around Here
        </p>
      </div>
    );
  } else {
    return (
      <div className="flex items-center justify-center flex-col">
        <h1 className="text-lg p-7 font-bold">Contracts</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {ids.map((contractID) => {
            return (
              <ContractPreviewCard
                key={contractID}
                ownerAddress={props.childWallet}
                contractNftID={contractID}
              />
            );
          })}
        </div>
      </div>
    );
  }
}
