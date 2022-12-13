import Image from "next/image";
import { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setVideo } from "../../redux/reducers/videoSlice";
import { RootState } from "../../redux/store";
import useHeader from "./hooks/useHeader";
import AuthSwitch from "../Common/Auth/modules/AuthSwitch";
import { useAccount } from "wagmi";
import useLensSignIn from "../Common/Auth/hooks/useLensSignIn";
import { setHamburger } from "../../redux/reducers/hamburgerSlice";
import Disconnect from "../Common/Auth/modules/Disconnect";
import { INFURA_GATEWAY } from "../../lib/lens/constants";

const Header: FunctionComponent = (): JSX.Element => {
  const dispatch = useDispatch();
  const video = useSelector((state: RootState) => state.app.videoReducer.value);
  const currentImage = useSelector(
    (state: RootState) => state.app.backgroundReducer.value
  );
  const { isConnected } = useAccount();
  const profileState = useSelector(
    (state: RootState) => state.app.authStatusReducer.value
  );
  const accountDrop = useSelector(
    (state: RootState) => state.app.hamburgerReducer.value
  );
  const { handleImageData } = useHeader();
  const { isError, isSuccess, handleLensLogin } = useLensSignIn();
  return (
    <div className="absolute w-full h-fit grid grid-flow-col auto-cols-auto justify-between py-10 px-6 z-30">
      <div className="relative w-fit h-fit col-start-1 text-white font-dosis text-7xl">
        THE DIAL
      </div>
      <div className="relative w-fit h-fit grid grid-flow-col auto-cols-auto col-start-2 gap-6 place-self-center">
        <div
          className="relative w-fit h-fit col-start-1 opacity-80 place-self-center cursor-pointer active:scale-95 hover:opacity-60"
          onClick={() => dispatch(setVideo(!video))}
        >
          <Image
            src={`${INFURA_GATEWAY}/ipfs/Qmb4h9vReob4VXMByg7Go1kUmacjuGAcTxft5Rq4SbSgXY`}
            alt="headerIcon1"
            width={50}
            height={50}
          />
        </div>
        <div
          className="relative w-fit h-fit col-start-2 opacity-80 place-self-center cursor-pointer active:scale-95 hover:opacity-60"
          onClick={() => handleImageData(currentImage)}
        >
          <Image
            src={`${INFURA_GATEWAY}/ipfs/QmTUha42rLj2Epo3XYMi5eAyKFryt2TFEhik7jFyfzh2dp`}
            alt="headerIcon2"
            width={50}
            height={50}
          />
        </div>
        <div
          className={`relative w-fit h-fit col-start-3 opacity-80 place-self-center grid grid-flow-row auto-rows-auto gap-3 ${
            isConnected &&
            profileState !== "profile" &&
            "cursor-pointer active:scale-95"
          }`}
          onClick={() => {
            ((isConnected && profileState === "no profile") ||
              (isConnected && isError) ||
              (isConnected && !isSuccess)) &&
              dispatch(setHamburger(!accountDrop));
          }}
        >
          <div className="relative row-start-1 w-6 h-px bg-white self-center"></div>
          <div className="relative row-start-2 w-6 h-px bg-white self-center"></div>
          {accountDrop && (
            <div className="absolute row-start-2 bg-white w-fit h-fit font-dosis grid grid-flow-row auto-rows-auto gap-3 p-2 z-10 justify-self-center top-2 whitespace-nowrap">
              <div
                className="relative text-black row-start-1 w-fit h-fit place-self-center text-xs hover:opacity-60 cursor-pointer"
                onClick={() => handleLensLogin()}
              >
                Lens Sign In
              </div>
              <div className="relative text-black row-start-2 w-fit h-fit place-self-center text-xs hover:opacity-60 cursor-pointer">
                <Disconnect />
              </div>
            </div>
          )}
        </div>
        <div className="relative w-fit h-fit col-start-4 opacity-80 place-self-center cursor-pointer active:scale-95 -top-1 hover:opacity-60">
          <AuthSwitch isConnected={isConnected} profileState={profileState} dispatch={dispatch} />
        </div>
      </div>
    </div>
  );
};

export default Header;
