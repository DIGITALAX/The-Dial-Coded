import Image from "next/legacy/image";
import { FunctionComponent, useEffect } from "react";
import { INFURA_GATEWAY } from "../../../../lib/lens/constants";
import { FollowInfoProps } from "../../types/common.types";
import { AiOutlineLoading } from "react-icons/ai";

const FollowInfo: FunctionComponent<FollowInfoProps> = ({
  type,
  approvalLoading,
  followLoading,
  usd,
  value,
  symbol,
  followTypedData,
  approveCurrency,
  isApproved,
  buttonText,
}): JSX.Element => {
  useEffect(() => {
    //refresh
  }, [approvalLoading]);
  return (
    <div className="relative w-full h-fit row-start-2 grid grid-flow-row auto-rows-auto font-dosis text-black text-center gap-3">
      {type === "revert" && (
        <div className="relative w-fit h-fit row-start-1 place-self-center p-3">
          This user isn't taking followers right now.
        </div>
      )}
      <div
        className={`relative w-fit h-fit ${
          type === "revert" ? "row-start-2" : "row-start-1"
        } place-self-center grid grid-flow-col auto-cols-auto pb-4`}
      >
        <div className="relative w-fit h-fit col-start-1 place-self-center grid grid-flow-col auto-cols-auto py-2 bg-gray-50 rounded-md px-2 drop-shadow-lg gap-3">
          <div className="relative w-44 h-60 flex col-start-1 place-self-center p-2">
            <Image
              src={`${INFURA_GATEWAY}/ipfs/QmXocVRnHgzAFZRzwx3N2MocKnrRYqbrMXJnwocBBHzmLK`}
              layout="fill"
              objectFit="cover"
              className="relative w-fit h-fit flex"
            />
          </div>
          {type !== "revert" && (
            <div className="relative col-start-2 place-self-center w-fit h-fit grid grid-flow-row auto-rows-auto font-dosis text-black text-center gap-3">
              <div className="relative w-fit h-fit row-start-1 grid grid-flow-row auto-rows-auto">
                <div className="relative w-fit h-fit text-offBlack font-digiB text-4xl place-self-center row-start-1">
                  {value} {symbol}
                </div>
                {!isNaN(Number(usd)) && (
                  <div className="relative w-fit h-fit text-offBlack/70 font-dosis text-sm place-self-center row-start-2 pr-2">
                    ${String(usd)?.slice(0, 6)}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      {type !== "revert" && (
        <div
          className={`relative w-28 h-10 rounded-md bg-offBlue grid grid-flow-col auto-cols-auto text-white font-dosis text-sm place-self-center text-center cursor-pointer hover:opacity-70 active:scale-95 ${
            type === "revert" ? "row-start-3" : "row-start-2"
          }`}
        >
          {followLoading || approvalLoading ? (
            <div className="relative w-fit h-fit animate-spin col-start-1 place-self-center text-center">
              <AiOutlineLoading color="white" size={15} />
            </div>
          ) : (
            <div
              className="relative w-full h-fit col-start-1 place-self-center text-center"
              onClick={() => {
                isApproved
                  ? followTypedData && followTypedData()
                  : approveCurrency && approveCurrency();
              }}
            >
              {buttonText}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FollowInfo;
