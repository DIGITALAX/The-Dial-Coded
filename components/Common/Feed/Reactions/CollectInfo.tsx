import Image from "next/legacy/image";
import { FunctionComponent, useEffect } from "react";
import { INFURA_GATEWAY } from "../../../../lib/lens/constants";
import { CollectInfoProps } from "../../types/common.types";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { setSignIn } from "../../../../redux/reducers/signInSlice";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { AiOutlineLoading } from "react-icons/ai";

const CollectInfo: FunctionComponent<CollectInfoProps> = ({
  showText,
  buttonText,
  buttonColor,
  type,
  symbol,
  value,
  usd,
  limit,
  time,
  totalCollected,
  canClick,
  isApproved,
  handleCollect,
  approveCurrency,
  collectLoading,
  approvalLoading,
}): JSX.Element => {
  const isConnected = useSelector(
    (state: RootState) => state.app.walletConnectedReducer.value
  );
  const lensProfile: string = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile?.id
  );
  const dispatch = useDispatch();
  const { openConnectModal } = useConnectModal();
  useEffect(() => {
    //collect refresh
  }, [approvalLoading])
  return (
    <div className="relative w-full h-fit row-start-2 grid grid-flow-row auto-rows-auto font-dosis text-black text-center gap-3">
      {showText && (
        <div className="relative w-fit h-fit row-start-1 place-self-center p-3">
          This post hasn&apos;t been collected. Will you be first?
        </div>
      )}
      <div
        className={`relative w-fit h-fit ${
          showText ? "row-start-2" : "row-start-1"
        } place-self-center grid grid-flow-col auto-cols-auto pb-4`}
      >
        <div className="relative w-fit h-fit col-start-1 place-self-center grid grid-flow-col auto-cols-auto py-2 bg-gray-50 rounded-md px-2 drop-shadow-lg gap-3">
          <div className="relative w-44 h-60 flex col-start-1 place-self-center p-2">
            <Image
              src={`${INFURA_GATEWAY}/ipfs/QmcHYeemWE3z8qy7m42pJbasYzyvMRWNPRMfXvSNz6XKoK`}
              layout="fill"
              objectFit="cover"
              className="relative w-fit h-fit flex"
            />
          </div>
          {type !== "FreeCollectModule" && (
            <div className="relative col-start-2 place-self-center w-fit h-fit grid grid-flow-row auto-rows-auto font-dosis text-black text-center gap-3">
              <div className="relative w-fit h-fit row-start-1 grid grid-flow-row auto-rows-auto">
                <div className="relative w-fit h-fit text-offBlack font-digiB text-4xl place-self-center row-start-1">
                  {value} {symbol}
                </div>
               {usd && <div className="relative w-fit h-fit text-offBlack/70 font-dosis text-sm place-self-center row-start-2 pr-2">
                  ${String(usd)?.slice(0, 6)}
                </div>}
              </div>
              {(limit || time) && (
                <div className="relative w-fit h-fit place-self-center row-start-2 grid grid-flow-row auto-rows-auto gap-2">
                  {limit && (
                    <div className="relative w-fit h-fit row-start-1 place-self-center">
                      Limited Edition:{" "}
                      {totalCollected ? Number(limit) - totalCollected : 0} /{" "}
                      {limit}
                    </div>
                  )}
                  {time && moment(time).isAfter() && (
                    <div
                      className={`relative w-fit h-fit ${
                        limit ? "row-start-2" : "row-start-1"
                      } place-self-center grid grid-flow-row auto-rows-auto text-sm`}
                    >
                      <div className="relative w-fit h-fit row-start-1 place-self-center">
                        Time Left to Collect:
                      </div>
                      <div className="relative w-fit h-fit row-start-2 place-self-center">
                        {moment(`${time}`).fromNow()}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div
        className={`relative w-28 h-10 rounded-md bg-${buttonColor} grid grid-flow-col auto-cols-auto text-white font-dosis text-sm place-self-center text-center ${
          canClick && "cursor-pointer hover:opacity-70 active:scale-95"
        } ${showText ? "row-start-3" : "row-start-2"}`}
      >
        {collectLoading || approvalLoading ? (
          <div className="relative w-fit h-fit animate-spin col-start-1 place-self-center text-center">
            <AiOutlineLoading color="white" size={15} />
          </div>
        ) : !canClick ? (
          <div className="relative w-full h-fit col-start-1 place-self-center text-center">
            {buttonText}
          </div>
        ) : !isConnected ? (
          <div
            className="relative w-full h-fit col-start-1 place-self-center text-center"
            onClick={openConnectModal}
          >
            Connect
          </div>
        ) : !lensProfile ? (
          <div
            className="relative w-full h-fit col-start-1 place-self-center text-center"
            onClick={() => dispatch(setSignIn(true))}
          >
            Sign In
          </div>
        ) : (
          <div
            className="relative w-full h-fit col-start-1 place-self-center text-center"
            onClick={() => {
              isApproved
                ? handleCollect && handleCollect()
                : approveCurrency && approveCurrency();
            }}
          >
            {buttonText}
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectInfo;
